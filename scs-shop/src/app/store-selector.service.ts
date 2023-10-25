import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreSelectorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getStore(storeId) {
    return this.httpClient.get(`api/store/${storeId}`);
  }

  getAllStores() {
    return this.httpClient.get('api/stores');
  }

  selectStore() {
    const selectButtons = document.querySelectorAll('.store');

    selectButtons.forEach(button => {
      button.addEventListener('click', () => {
        const storeName = button.closest('.store').querySelector('.store-name').textContent;
        const storeId = button.closest('.store').children[0].id;
        this.setLocation(storeName, storeId);
        document.getElementById('storeLocation').innerHTML = storeName;
      });
    });
  }
  
  setLocation(name: string, id: string) {
    if (typeof(Storage) != "undefined") {
      localStorage.setItem("location", name);
      localStorage.setItem("locationID", id);
    } else {
      console.log("Local storage unavailable")
    }
  }
  
  getLocationOnLoad() {
    if (window.localStorage.getItem("location")) {
      document.getElementById("storeLocation").innerHTML = window.localStorage.getItem("location")
    }
  }

  getLocation() {
    if (window.localStorage.getItem("location")) {
      return window.localStorage.getItem("location")
    }
    return null;
  }

  getLocationID() {
    if (window.localStorage.getItem("locationID")) {
      return window.localStorage.getItem("locationID")
    }
    return null;
  }
}
