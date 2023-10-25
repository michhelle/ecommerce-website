import { Component } from '@angular/core';
import { StoreSelectorService } from '../store-selector.service';

@Component({
  selector: 'app-storeselector-checkout',
  templateUrl: './storeselector-checkout.component.html',
  styleUrls: ['./storeselector-checkout.component.css']
})
export class StoreselectorCheckoutComponent {
  currentStore = ""
  stores: any;

  constructor (
    private storeService: StoreSelectorService,
  ) {}

  ngOnInit() {
    this.currentStore = this.getSelectedStore();
    this.storeService.getAllStores().subscribe(response => {
      this.stores = response;
    });
  }

  selectStore() {
    this.storeService.selectStore();
    window.location.reload();
  };

  getSelectedStore() {
    return this.storeService.getLocation();
  }
}
