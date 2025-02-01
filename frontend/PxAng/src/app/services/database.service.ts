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

  constructor(private http:HttpClient) { }

  getProduct(){
    return this.http.get("/get/product", httpOptions )
  }

  getProductId(id: string): Observable<Product> {
    return this.http.get<Product>(`http://localhost:1010/get/product/${id}`, httpOptions);
  }

  getOrderUserId(userId: string){
    return this.http.get(`/list/orders/${userId}`, httpOptions)
  }

  addItemToCart(productId: string, quantity: number, uid:string): Observable<any> {
    const body = {quantity, uid};
    return this.http.post(`/purchase/product/${productId}`, body, httpOptions);
  }

  deleteOrder(orderId: string){
    return this.http.delete(`/cancel/order/${orderId}`, httpOptions)
  }

  updateOrderQuantity(orderId: string, quantityToRemove: number){
    const body = {quantityToRemove}
    return this.http.put(`/decrease/order/quantity/${orderId}`, body, httpOptions)
  }

  getOrderId(orderId: string): Observable<any> {
    return this.http.get(`/get/order/${orderId}`, httpOptions);
  }

  getUserOrder(uid: string){
    return this.http.get(`/get/user/${uid}`,httpOptions)
  }
  

  paymentGateway(orderId: string){
    return this.http.post(`/payment/api/${orderId}`, {}, httpOptions);
  }

}
