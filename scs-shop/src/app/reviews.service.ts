import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    private url = 'api/reviews'; 
    private addReviewUrl = 'api/add-review';
    constructor (private httpClient: HttpClient) {}

    getReviews() {
        return this.httpClient.get(this.url);
    }

    addReview(reviewInfo: Object){
        return this.httpClient.post<any>(this.addReviewUrl, reviewInfo);
    }
}