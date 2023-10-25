import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ItemsComponent } from './items/items.component';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { MapComponent } from './map/map.component';
import { StoreselectorCheckoutComponent } from './storeselector-checkout/storeselector-checkout.component';
import { StoreSelectorNavComponent } from './storeselector-nav/storeselector-nav.component';
import { CartComponent } from './cart/cart.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { DbMaintainComponent } from './db-maintain/db-maintain.component';
import { ServicesComponent } from './services/services.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ItemsComponent,
    IndexComponent,
    ReviewsComponent,
    AboutComponent,
    CheckoutComponent,
    InvoiceComponent,
    MapComponent,
    StoreselectorCheckoutComponent,
    StoreSelectorNavComponent,
    CartComponent,
    ReviewsComponent,
    DbMaintainComponent,
    ServicesComponent,
    OrdersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
