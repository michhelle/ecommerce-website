import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common'; 
import { ReviewsService } from '../reviews.service';
import { AuthService } from '../auth.service';
import { ItemService } from '../item.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface ReviewsResponse {
    status: string;
    result: any[];
    count: number;
  }

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  reviews : any;
  reviewCount : number;
  reviewForm: FormGroup;
  itemList : any;

  constructor(
    private ReviewsService: ReviewsService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private ItemService: ItemService,
    ){};  
  
  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      product: ['', Validators.required],
      title: ['', Validators.required],
      review: ['', Validators.required],
      rating: ['', Validators.required],
      userid: [this.getCurrentUser()],
      username: [this.getCurrentUsername()]
    });
    this.ReviewsService.getReviews().subscribe((response: ReviewsResponse) => {
      this.reviews = response.result;
      this.reviewCount = response.count;
    });
    this.ItemService.getItems()
      .subscribe(response => {
        this.itemList = response;
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  reviewCountIsOne() {
    if (this.reviewCount == 1) {
        return true;
    }
    return false;
  }

  getDate(str) {
    let year = str.slice(0,4);
    let month = str.slice(5,7);
    let date = str.slice(8, 10);
    let result = `${month}/${date}/${year}`;
    return result;
  }

  loggedIn() {
    return this.auth.loggedIn();
  }

  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  getCurrentUsername() {
    return this.auth.getCurrentUsername();
  }

  addReview() {
    this.ReviewsService.addReview(this.reviewForm.value).subscribe((result) => {
        if (result.status == 'OK') {
            document.getElementById('formMessage').innerHTML = "Your review has been posted! Reloading in 3...";
            setTimeout(function() {
              window.location.reload();
            }, 3000);
        } else {
            console.log(result.status)
            document.getElementById('formMessage').innerHTML = "Couldn't post review, please try again later.";
        }
    })
  }
}
