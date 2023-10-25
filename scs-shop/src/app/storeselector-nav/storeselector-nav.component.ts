import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeocodingService } from '../geocoding.service';
import { StoreSelectorService } from '../store-selector.service';

@Component({
  selector: 'app-storeselector-nav',
  templateUrl: './storeselector-nav.component.html',
  styleUrls: ['./storeselector-nav.component.css']
})
export class StoreSelectorNavComponent {
  stores : any;

  constructor(
    private geocodingService: GeocodingService,
    private storeService: StoreSelectorService,
  ) { }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.geocodingService.geocodeLatLng(pos).then((response) => {
          var city = response.results[0].address_components[2].long_name;
          var postal = response.results[0].address_components[6].long_name;
          console.log(city, postal);

          this.findStores(city, postal);
        })
      });
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }

  findStores(city: string, postcode: string) {
    document.getElementById('postalCode').innerHTML = postcode
    console.log(this.stores)
    // switch (city) {
    //   case 'Toronto':
    //     document.getElementById('storeLocation').innerHTML = "Queen St W, Toronto"
    //     this.storeService.setLocation("Queen St W, Toronto")
    //     break
    //   case 'Markham':
    //     document.getElementById('storeLocation').innerHTML = "CF Markville, Markham"
    //     this.storeService.setLocation("CF Markville, Markham")
    //     break
    //   case 'Mississauga':
    //     document.getElementById('storeLocation').innerHTML = "Square One Shopping Centre, Mississauga"
    //     this.storeService.setLocation("Square One Shopping Centre, Mississauga")
    //     break
    //   default:
    //     document.getElementById('storeLocation').innerHTML = "No store selected"
    // }
  }

  // getAllStores() {
  //   this.storeService.getAllStores();
  // }

  selectStore() {
    this.storeService.selectStore();
  }

  ngOnInit() {
    this.storeService.getLocationOnLoad()
    this.storeService.getAllStores().subscribe(response => {
      this.stores = response;
    });
  }
}
