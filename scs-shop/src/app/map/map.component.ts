import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker, MapDirectionsService, MapGeocoder } from '@angular/google-maps';
import { GeocoderResponse } from '../models/geocoder-response.model';
import { GeocodingService } from '../geocoding.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  center: google.maps.LatLngLiteral = {lat: 43.663586, lng: -79.4418618};
  zoom = 9;

  directionsResults$: Observable<google.maps.DirectionsResult|undefined>;

  constructor(
    mapDirectionsService: MapDirectionsService,
    private geocoder: MapGeocoder
  ) {
    const trip = JSON.parse(sessionStorage.getItem("trip"));
    console.log(trip)

    const store = trip["source"];
    const dest = trip["dest"];

    geocoder.geocode({
      address: store,
      region: "CA"
    }).subscribe(({results}) => {
      //console.log(results)
      const origin = results[0]["geometry"]["location"];

      geocoder.geocode({
        address: dest,
        region: "CA"
      }).subscribe(({results}) => {
        const dest = results[0]["geometry"]["location"];

        const request: google.maps.DirectionsRequest = {
          destination: dest,
          origin: origin,
          travelMode: google.maps.TravelMode.DRIVING
        };
  
        this.directionsResults$ = mapDirectionsService.route(request).pipe(map(response => response.result));
      })
    });
  }

  static activateMap(info) {
    const source = [info["StoreAddress"], info["StoreCity"], info["StoreProvince"]].join(", ");
    const dest = [info["DestAddress"], info["DestCity"], info["DestProvince"], info["DestPostcode"]].join(", ")

    const trip = {
      "TripID": info["TripID"],
      "source": source,
      "dest": dest
    }

    sessionStorage.setItem("trip", JSON.stringify(trip))
    //json.stringify, store in local

    if (sessionStorage.getItem("trip")) {
      return true;
    } else {
      return false;
    }
     //return true once data stored
  }

  /* onMapDragEnd(event: google.maps.KmlMouseEvent) {
    const point: google.maps.LatLngLiteral = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    this.geocoderWorking = true;
    this.geocodingService
      .geocodeLatLng(point)
      .then((response: GeocoderResponse) => {
        if (response.status === 'OK') {
          if (response.results.length) {
            const value = response.results[0];

            this.locationCoords = new google.maps.LatLng(point);

            this.mapCenter = new google.maps.LatLng(point);
            this.map.panTo(point);

            this.address = value.formatted_address;
            this.formattedAddress = value.formatted_address;

            this.markerInfoContent = value.formatted_address;
          }
        }
      })
      .finally(() => {
        this.geocoderWorking = false;
      });
  }
  constructor(private geocodingService: GeocodingService) {}

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  mapZoom = 9;
  mapCenter: google.maps.LatLng;
  Center: google.maps.LatLngLiteral = {
    lat: 43.652817020875794,
    lng: -79.38178268258154,
  };

  mapOptions: google.maps.MapOptions = {
    center: this.Center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: 43.654919, lng: -79.379288 },
    { lat: 43.868599, lng: -79.279297 },
    { lat: 43.593079, lng: -79.642494 },
  ];

  geocoderWorking = false;
  geolocationWorking = false;

  address: string;
  formattedAddress?: string | null = null;
  locationCoords?: google.maps.LatLng | null = null;

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  } */
}
