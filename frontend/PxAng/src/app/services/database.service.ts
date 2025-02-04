import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/productModel';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'https://px-final-1.onrender.com'; // Backend URL


  constructor(private http:HttpClient) { }

  getProduct(){
    return this.http.get(`${this.apiUrl}/get/product`, httpOptions )
  }

  getProductId(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get/product/${id}`, httpOptions);
  }

  getOrderUserId(userId: string){
    return this.http.get(`${this.apiUrl}/list/orders/${userId}`, httpOptions)
  }

  addItemToCart(productId: string, quantity: number, uid:string): Observable<any> {
    const body = {quantity, uid};
    return this.http.post(`${this.apiUrl}/purchase/product/${productId}`, body, httpOptions);
  }

  deleteOrder(orderId: string){
    return this.http.delete(`${this.apiUrl}/cancel/order/${orderId}`, httpOptions)
  }

  updateOrderQuantity(orderId: string, quantityToRemove: number){
    const body = {quantityToRemove}
    return this.http.put(`${this.apiUrl}/decrease/order/quantity/${orderId}`, body, httpOptions)
  }

  getOrderId(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/order/${orderId}`, httpOptions);
  }

  getUserOrder(uid: string){
    return this.http.get(`${this.apiUrl}/get/user/${uid}`,httpOptions)
  }
  
  paymentGateway(firebaseUid: string) {
    this.http.post<{ url: string }>(`${this.apiUrl}/payment/api/${firebaseUid}`, {}, httpOptions)
      .subscribe(
        (response) => {
          if (response.url) {
            window.location.href = response.url; // Redirect user to Stripe Checkout
          }
        },
        (error) => {
          console.error('Error initiating payment:', error);
        }
      );
  }
  


}
