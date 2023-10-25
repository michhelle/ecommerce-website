import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'api/login';
  private signupUrl = 'api/signup';

  errorData = {};
   
  constructor(
    private httpClient: HttpClient
  ) { }
  
  login (email: string, password: string) {
    return this.httpClient.post<any>(this.loginUrl, {"email": email, "password": password})
      .pipe(map(user => {
        if (user) {
          return user[0];
        }
      }),
      catchError((err) => {
        return throwError(err);
      }));
  };

  logout() {
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('postcode');
    sessionStorage.removeItem('balance');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem("trip");
  }

  signup (signupInfo: Object) {
    //console.log('check email');
    return this.httpClient.post<any>(this.signupUrl, signupInfo);
  }

  checkIfExists (email: string) {
    const emailUrl = 'api/signup/exists'
    return this.httpClient.post<any>(emailUrl, {"email": email})
  }

  setCurrentUser(userInfo: Object) {
    sessionStorage.setItem('userid', userInfo["UserID"])
    sessionStorage.setItem('name', userInfo["UserName"]);
    sessionStorage.setItem('email', userInfo["Email"]);
    sessionStorage.setItem('phone', userInfo["Phone"]);
    sessionStorage.setItem('address', userInfo["UserAddress"]);
    sessionStorage.setItem('postcode', userInfo["CityCode"]);
    sessionStorage.setItem('balance', userInfo["Balance"]);
    sessionStorage.setItem('isAdmin', userInfo["Administrator"]);
  }

  getCurrentUser() {
    return sessionStorage.getItem('userid');
  }

  getCurrentUsername() {
    return sessionStorage.getItem('name')
  }

  loggedIn() {
    return (sessionStorage.getItem('userid')) ? true : false;
  }
}
