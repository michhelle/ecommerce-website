import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { ItemsComponent } from './items/items.component';
import { AboutComponent } from './about/about.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CartComponent } from './cart/cart.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { DbMaintainComponent } from './db-maintain/db-maintain.component';
import { ServicesComponent } from './services/services.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: DbMaintainComponent },
  { path: 'services', component: ServicesComponent},
  { path: 'orders', component: OrdersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
