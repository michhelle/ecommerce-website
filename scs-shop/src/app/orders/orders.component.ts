import { Component } from '@angular/core';
import { DbService } from '../db.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders = [];
  constructor (
    private db: DbService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    const currentUser = this.auth.getCurrentUser();

    this.db.read(`select OrderID, DateIssued from order_info where UserID=${currentUser}`)
    .subscribe(result => {
      if (result["status"] == "OK") {
        this.orders = result["info"];
        console.log(this.orders)
      } else {
        console.log(result["err"])
      }
    })
  }
}
