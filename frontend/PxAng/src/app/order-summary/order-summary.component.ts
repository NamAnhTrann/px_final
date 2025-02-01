import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule],
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  userId: string = '';
  orders: any[] = []; // Stores fetched orders
  totalAmount: number = 0;
  groupedOrders: any[] = []; // Stores grouped orders by product name

  constructor(private route: ActivatedRoute, private dbService: DatabaseService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const extractedId = params.get('uid');
      this.userId = extractedId ? extractedId : '';

      console.log("Extracted User ID from route:", this.userId);

      if (!this.userId) {
        console.error("User ID is missing from route.");
        return;
      }

      this.fetchOrders();
    });
  }

  fetchOrders() {
    if (!this.userId) {
      console.error("User ID is missing.");
      return;
    }

    this.dbService.getUserOrder(this.userId).subscribe({
      next: (data: any) => {
        console.log("Fetched user orders:", data);
        this.orders = data.orders || []; // Ensure orders are assigned
        this.groupOrders(); // ✅ Group orders by product name
        this.calculateTotalAmount();
      },
      error: (error: any) => {
        console.error("Error fetching orders:", error);
      }
    });
  }

  /**
   * Groups orders by product name instead of order ID
   */
  groupOrders() {
    const productMap = new Map<string, any>(); // Use product name as key

    this.orders.forEach(order => {
      if (!order.productId || !order.productId.productName) return; // Prevent undefined errors

      const productName = order.productId.productName; // Grouping key

      if (!productMap.has(productName)) {
        productMap.set(productName, {
          productName: productName,
          productImage: order.productId.productImage,
          totalQuantity: 0,
          totalAmount: 0
        });
      }

      let groupedProduct = productMap.get(productName);
      groupedProduct.totalQuantity += order.quantity;
      groupedProduct.totalAmount += order.totalAmount || 0;
    });

    this.groupedOrders = Array.from(productMap.values());
    this.totalAmount = this.groupedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    console.log("Grouped Orders by Product Name:", JSON.stringify(this.groupedOrders, null, 2)); // Debugging
  }

  /**
   * Calculates total amount across all orders.
   */
  calculateTotalAmount() {
    this.totalAmount = this.groupedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    console.log("Total amount for all orders:", this.totalAmount);
  }
}
