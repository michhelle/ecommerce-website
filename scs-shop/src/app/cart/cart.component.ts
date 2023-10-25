import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ItemService } from '../item.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  currentUser;
  fullCart = [];
  quantities = [1,2,3,4,5];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private auth: AuthService,
    private cart: CartService
  ) { }

  ngOnInit() {
    //console.log(this.auth.loggedIn());
    this.currentUser = this.auth.getCurrentUser();
    this.cart.getCart(this.currentUser).subscribe(result => {
      console.log(result)
      if (result["status"] == "OK") {
        this.fullCart = result["info"];
      }
    })   
  }

  // item ids from cart => full item info
  /* mapCartItems(cart: Array<string>) {
    let itemList = cart.map((id) => {
      // const itemInfo = this.availableItems.filter(item => item.ItemID == id)[0];
      // itemInfo.InCart = 1;
      return this.availableItems.filter(item => item.ItemID == id)[0];
    })
    //console.log(itemList)
    return itemList;
  } */
  
  clearCart() {
    //sessionStorage.removeItem("cart");
    this.cart.clearCart(this.currentUser).subscribe(result => {
      if (result["status"] == "OK") {
        window.location.reload();
      } else {
        console.log(result);
      }
    });
  }

  deleteItem(event) {
    var [itemId, size] = event.target.parentElement.parentElement.id.split("-");

    const payload = {
      "user": this.currentUser,
      "item": itemId,
      "size": size
    }
    //console.log(payload)
    this.cart.deleteItem(payload).subscribe(result => {
      if (result["status"] == "OK") {
        window.location.reload();
      } else {
        console.log(result);
      }
    })
  }

  cartSubtotal() {
    let prices = this.fullCart.map((item) => {
      return item.ItemPrice;
    })
    const subtotal = prices.reduce((a, b) => a + b, 0);
    return subtotal;
  }

  checkout() {
    sessionStorage.setItem("fullCart", JSON.stringify(this.fullCart));
    this.router.navigate(['/checkout']);
  }

  loggedIn() {
    return this.auth.loggedIn();
  }
}
