import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreSelectorService } from '../store-selector.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  static POSTCHECK: RegExp = /^([a-zA-Z]\d[a-zA-Z])\ {0,1}(\d[a-zA-Z]\d)$/;
  static EXPCHECK: RegExp = /^\d{2}\/{0,1}\d{2}$/;
  static CVVCHECK: RegExp = /^\d{3}$/;
  static CCCHECK: RegExp = /^\d{4}\ {0,1}\d{4}\ {0,1}\d{4}\ {0,1}\d{4}$/;

  currentUser;
  cart = []
  provinces = ["AB", "BC", "MB", "NB","NL","NS","NT","NU","ON","PE","QC","SK","YT"];
  defaultProvince = "ON";
  currentStore = "";
  currentStoreId;
  mapActive = false;
  activeCoupon = {CouponID: 0, CouponCode: "", CouponDiscount: 1};
  //0: shipping, 1: delivery, 2: payment
  checkoutStep = 0;

  constructor (
    private router: Router,
    private storeSelectorService: StoreSelectorService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private auth: AuthService
  ) {}

  shipToForm = this.formBuilder.group({
    fn: ["", Validators.required],
    ln: ["", Validators.required],
    address: ["", Validators.required],
    city: ["", Validators.required],
    province: ["ON", Validators.required],
    postcode: ["", [
      Validators.required,
      Validators.maxLength(7),
      this.regexValidator({pattern: CheckoutComponent.POSTCHECK, msg: "Invalid postal code"})
    ]]
  })

  get fn() {return this.shipToForm.get('fn')};
  get ln() {return this.shipToForm.get('ln')};
  get address() {return this.shipToForm.get('address')};
  get city() {return this.shipToForm.get('city')};
  get province() {return this.shipToForm.get('province')};
  get postcode() {return this.shipToForm.get('postcode')};

  paymentForm = this.formBuilder.group({
    card: ["", [
      Validators.required,
      this.regexValidator({pattern: CheckoutComponent.CCCHECK, msg: "Invalid card number"}),
    ]],
    expiry: ["", [
      Validators.required,
      this.regexValidator({pattern: CheckoutComponent.EXPCHECK, msg: "Invalid expiry"}), //fix this check
    ]],
    cvv: ["", [
      Validators.required,
      this.regexValidator({pattern: CheckoutComponent.CVVCHECK, msg: "Invalid CVV"}),
    ]],
    paymentPC: ["", [
      Validators.required,
      this.regexValidator({pattern: CheckoutComponent.POSTCHECK, msg: "Invalid postal code"})
    ]]
  })

  get card() {return this.paymentForm.get('card')};
  get expiry() {return this.paymentForm.get('expiry')};
  get cvv() {return this.paymentForm.get('cvv')};
  get paymentPC() {return this.paymentForm.get('paymentPC')};

  regexValidator(config: any): ValidatorFn {
    return (control: AbstractControl) => {
      let regex: RegExp = config.pattern;
      if (control.value && !control.value.match(regex)) {
        return {
          invalidMsg: config.msg
        };
      } else {
        return null;
      }
    };
  }

  formatPostcode(postcode: string): string {
    const upper = postcode.toUpperCase();
    if (postcode.length == 6) {
      return upper.slice(0, 3) + " " + upper.slice(3);
    } else {
      return upper;
    }
  }

  formatCardNum(card: string): string {
    return card.replaceAll(' ', '');
  }

  formatExpiry(expiry: string): string {
    return !expiry.includes('/') ? expiry.slice(0,2) + "/" + expiry.slice(2) : expiry;
  }

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.cartService.getCart(this.currentUser).subscribe(result => {
      if (result["status"] == "OK") {
        this.cart = result["info"];
      }
    });
  }

  cartSubtotal() {
    let prices = this.cart.map((item) => {
      return item.ItemPrice;
    })
    const subtotal = prices.reduce((a, b) => a + b, 0);
    return subtotal;
  }

  back() {
    (this.checkoutStep > 0) ? this.checkoutStep -= 1 : this.router.navigate(['/cart']);
    console.log(this.checkoutStep);
  }

  toDelivery() {
    this.currentStore = this.storeSelectorService.getLocation();
    this.currentStoreId = this.storeSelectorService.getLocationID();
    this.shipToForm.controls['postcode'].setValue(this.formatPostcode(this.postcode.value));

    this.storeSelectorService.getStore(this.currentStoreId).subscribe(response => {
      //console.log(response["info"][0])
      const info = {
        "StoreAddress": response["info"][0]["StoreAddress"],
        "StoreCity": response["info"][0]["StoreCity"],
        "StoreProvince": response["info"][0]["StoreProvince"],
        "DestAddress": this.address.value,
        "DestCity": this.city.value,
        "DestProvince": this.province.value,
        "DestPostcode": this.postcode.value
      }
      
      this.mapActive = MapComponent.activateMap(info);
      this.checkoutStep += 1;
    })
  }

  toPayment() {
    this.checkoutStep += 1;
  }

  submitOrder() {
    this.verifyPayment();

    const cartItems = this.cart.map(item => {
      return {"item": item.ItemID, "quantity": item.Quantity, "size": item.ItemSize};
    })

    let payload = {
      "cartItems": cartItems,
      "subtotal": this.cartSubtotal(),
      "storeId": this.currentStoreId,
      "destAddress": this.address.value,
      "destCity": this.city.value,
      "destProvince": this.province.value,
      "destPostcode": this.postcode.value,
      "userId": this.currentUser,
      "coupon": this.activeCoupon,
    }

    this.cartService.checkout(payload)
      .subscribe((result) => {
        if (result["status"] == "OK") {
          const orderId = result["orderId"];
          this.cartService.clearCart(this.currentUser).subscribe(result => {
            if (result["status"] == "OK") {
              sessionStorage.removeItem("trip");
              this.router.navigate(['/invoice'], {queryParams: {order: orderId}})
            } else {
              console.log(result);
            }
          });
        }
      });
  }

  validateCoupon() {
    const couponCode = (<HTMLInputElement>document.getElementById("coupon")).value.toUpperCase();
    if (couponCode) {
      //console.log(couponCode);
      this.cartService.getAllCoupons().subscribe((result: Array<any>) => {
        const coupon = result.find(coupon => coupon.CouponCode == couponCode);
        if (coupon) {
          this.activeCoupon = coupon;
          console.log(this.activeCoupon);
          (<HTMLInputElement>document.getElementById("coupon")).value = coupon.CouponCode;
          document.getElementById('coupon-error').innerHTML = "";
        } else {
          document.getElementById('coupon-error').innerHTML = "Not a valid coupon";
        }
      })
    }
  }

  deactivateCoupon() {
    this.activeCoupon = {CouponID: 0, CouponCode: "", CouponDiscount: 1};
  }

  verifyPayment() {
    // does nothing for now; only formats data
    this.paymentForm.controls['card'].setValue(this.formatCardNum(this.card.value));
    this.paymentForm.controls['expiry'].setValue(this.formatExpiry(this.expiry.value));
    this.paymentForm.controls['paymentPC'].setValue(this.formatPostcode(this.paymentPC.value));
  }
}
