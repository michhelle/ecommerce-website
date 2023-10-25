import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  addToCart(payload) {
    return this.httpClient.post('/api/cart/add', payload);
  }

  getCart(user) {
    return this.httpClient.post('/api/cart', {"user": user});
  }

  deleteItem(payload) {
    return this.httpClient.post('/api/cart/delete', payload);
  }

  clearCart(user) {
    return this.httpClient.post('/api/cart/deleteAll', {"user": user});
  }

  getAllCoupons() {
    return this.httpClient.get('/api/coupon');
  }

  checkout(payload) {
    return this.httpClient.post('/api/checkout', payload);
  }
}
