import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../model/productModel';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { Order } from '../model/orderModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {

product: Product[] = []; 
relatedProducts :Product[]=[];
currentProductId: string = '';
uid: string = '';
orderId: string = '';
orders: Order[] = [];

paymentStatus: string = "";
amount: number = 0;


  constructor(private db: DatabaseService, private router: ActivatedRoute, private route:Router, private authService: AuthService ){}

  //fetch the params  
  ngOnInit() {
    this.uid = this.authService.uid;
    // this.db.getOrderId()

    this.router.paramMap.subscribe(params => {
      const id = params.get('id')!; //! means null checker
      console.log('Extracted ID:', id); 
      this.getProductDetail(id);    
    });
  }
  
  //function use to get product details
  getProductDetail(id: string) {
    this.db.getProductId(id).subscribe((data: any) => {
      console.log('Fetched Product:', data); 
      this.currentProductId = id; 
      this.product = data; 
      this.relatedProduct(id);
    }, error => {
      console.error('Error fetching product details:', error); // aaaaaaaaaaaa
    });
  }
  
  getProductId(id: string){
    this.route.navigate(['/product-view', id])
  }

  getOrdersForUser(){
    this.db.getOrderUserId(this.uid).subscribe((data:any)=>{
      console.log("Orders fetched successfully:", data);
    })

  }
  goToOrderSummary() {
    if (!this.uid) {
      console.error("User ID is missing. Cannot fetch orders.");
      this.route.navigate(['/signup'])
      return;
    }
  
    console.log("Navigating to order summary for user:", this.uid);
    this.route.navigate(["/order-summary", this.uid]); // Pass User ID instead
  }
  
  
  //related product section
  relatedProduct(currentProductId: string) {
    this.db.getProduct().subscribe(
      (data: any) => {
        console.log('Fetched Related Products:', data);
          let filteredProduct = data.filter(function(product:any){
            console.log('Comparing:', product._id, 'with', currentProductId); // Debug log
            return product._id !== currentProductId
          });
          this.relatedProducts = filteredProduct.slice(0, 3);
        },
      (error: any) => {
        console.error('Error fetching related products:', error);
      }
    );
  }

  AddToCart(productId: string, quantity: number) {
    if (!this.uid) {
      console.error('User not logged in. Redirecting to signup...');
      
      // Redirect to signup page
      this.route.navigate(['/signup']);

      // Stop execution to prevent API call
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



  
  
  

}
