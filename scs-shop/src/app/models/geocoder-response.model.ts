export class GeocoderResponse {
    status: string;
    results: google.maps.GeocoderResult[] | null;
  
    constructor(status: string, results: google.maps.GeocoderResult[] | null) {
      this.status = status;
      this.results = results;
    }
}