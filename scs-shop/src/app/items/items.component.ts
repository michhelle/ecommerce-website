import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ItemService } from '../item.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {
  items : any;
  sizes = ['S', 'M', 'L'];
  quantities = [1,2,3,4,5];
  toastMsg = "";
  showToast = false;

  constructor(
    private itemService: ItemService,
    private auth: AuthService,
    private cart: CartService,
  ) { }

  ngOnInit() {      
    this.itemService.getItems()
      .subscribe(response => {
        this.items = response;
      });
  }

  onDrag(event) {
    //event.dataTransfer.clearData();
    //console.log(event.target.id)
    const userId = this.auth.getCurrentUser();
    const itemId = event.target.id;
    const size = (<HTMLInputElement>document.getElementById(`size-${itemId}`)).value
    const quant = (<HTMLInputElement>document.getElementById(`quantity-${itemId}`)).value

    let data = {
      "user": userId,
      "item": itemId,
      "quantity": quant,
      "size": size
    }
    //console.log(JSON.stringify(data))

    event.dataTransfer.setData("text", JSON.stringify(data));
    //event.dataTransfer.setData("text/plain", "text");
  }

  addToCart(event) {
    const userId = this.auth.getCurrentUser();
    const itemId = event.target.parentElement.id;
    const size = (<HTMLInputElement>document.getElementById(`size-${itemId}`)).value
    const quant = (<HTMLInputElement>document.getElementById(`quantity-${itemId}`)).value
    
    const payload = {
      "user": userId,
      "item": itemId,
      "quantity": quant,
      "size": size
    }

    //console.log(payload)
    if (this.auth.getCurrentUser()) {
      this.cart.addToCart(payload).subscribe(result => {
        console.log(result)
        if (result["status"] != "ERR") {
          this.toastMsg = "Added to cart";
          this.showToast = true;
          setTimeout(() => { this.showToast = false }, 3000);
        } else {
          this.toastMsg = "Item is already in cart";
          this.showToast = true;
          setTimeout(() => { this.showToast = false }, 3000);
        }
      })
    } else {
      this.toastMsg = "Please log in to shop";
      this.showToast = true;
      setTimeout(() => { this.showToast = false }, 3000);
    }
    

    /* var cartItems = {};
    if (! sessionStorage.getItem("cart")) {
      cartItems = {
        "cartItemIds": [itemId]
      }
    } else {
      cartItems = JSON.parse(sessionStorage.getItem("cart"));
      cartItems["cartItemIds"].push(itemId);
    }

    sessionStorage.setItem("cart", JSON.stringify(cartItems));
    console.log(cartItems); */
  }
}
