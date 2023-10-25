import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  order: any;
  rows: any;
  activeCoupon = {CouponID: 0, CouponCode: "", CouponDiscount: 1};
  mapActive = false;

  constructor (
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cart: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((result) => {
      this.order = result["order"];
      //console.log(this.order)

      this.httpClient.get('api/invoice/' + this.order)
        .subscribe(response => {
          this.rows = response;
          //console.log(response)
          if (response[0]["CouponID"]) {
            this.cart.getAllCoupons().subscribe((result: Array<any>) => {
              this.activeCoupon = result.filter(item => {return item["CouponID"] == this.rows[0]["CouponID"]})[0];
            })
          }

          this.mapActive = MapComponent.activateMap(response[0]);
        })
    })
  }

  activateMap(info) {
    // format json
    /* const trip = {
      "TripID": info["TripID"],
      "StoreAddress": info["StoreAddress"],
      "StoreCity": info["StoreCity"],
      "StoreProvince": info["StoreProvince"],
      "DestAddress": info["DestAddress"],
      "DestCity": info["DestCity"],
      "DestProvince": info["DestProvince"],
      "DestPostcode": info["DestPostcode"]
    } */

    const source = [info["StoreAddress"], info["StoreCity"], info["StoreProvince"]].join(", ");
    const dest = [info["DestAddress"], info["DestCity"], info["DestProvince"], info["DestPostcode"]].join(", ")

    const trip = {
      "TripID": info["TripID"],
      "source": source,
      "dest": dest
    }

    sessionStorage.setItem("trip", JSON.stringify(trip))
    //json.stringify, store in local

    if (sessionStorage.getItem("trip")) {
      return true;
    } else {
      return false;
    }
     //return true once data stored
  }
}
