import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  getUserAgent() {
    //console.log(window.navigator.userAgent);
    return window.navigator.userAgent;
  }
}
