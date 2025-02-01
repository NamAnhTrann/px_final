import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../model/productModel';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  product: Product[] = []; 
  uid: string = "";

  constructor(private db: DatabaseService, private router:Router,private authService: AuthService){}
  ngOnInit() {
    this.db.getProduct().subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.product = data; // Assign only if it's an array
      } else {
        console.error('Invalid data format:', data);
        this.product = []; // Fallback to an empty array
      }
    });
    this.uid = this.authService.getUserId() || ""; 
    console.log("User UID in ProductListComponent:", this.uid);
  }

  AddToCart(productId: string, quantity: number) {
    if (!this.uid) {
      console.error('User not logged in. Cannot add to cart.');
      this.router.navigate(['/signup'])
      return;
    }
  
    console.log('Adding to cart:', { productId, quantity, uid: this.uid });
  
    this.db.addItemToCart(productId, quantity, this.uid).subscribe(
      (data: any) => {
        console.log('Received response from backend:', data);
  
        if (data && data.order) {
          this.getOrdersForUser(); // Fetch all orders again
        } else {
          console.error('Order creation failed. Full response:', data);
        }
      },
      (error: any) => {
        console.error('Error adding to cart:', error);
      }
    );
  }
  getOrdersForUser(){
    this.db.getOrderUserId(this.uid).subscribe((data:any)=>{
      console.log("Orders fetched successfully:", data);
    })

  }

  

  getProductId(id:string){
    this.router.navigate(['/product-view', id])
  }
  



}
