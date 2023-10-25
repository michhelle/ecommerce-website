import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = 'api/items';
   
  constructor(private httpClient: HttpClient) { }
  
  getItems(){
    return this.httpClient.get(this.url);
  }
}
