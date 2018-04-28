const GoogleMaps = require('google-maps');

const MapView = function (container, options) {
  this.container = container;
  this.options = options;
  this.google = null;
  this.googleMap = null;
  this.directionsService = null;
  this.directionsRenderer = null;
  this.markers = [];
  this.route = null;
};

MapView.prototype.render = function () {
  GoogleMaps.load((google) => {
    this.google = google;
    this.googleMap = new this.google.maps.Map(this.container, this.options);
    this.directionsService = new this.google.maps.DirectionsService();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer();
    this.addMarkerOnClick();
    console.log(this.directionsService);
    this.directionsRenderer.setMap(this.googleMap);
  });
};

MapView.prototype.addMarker = function (coords) {
  const marker = new this.google.maps.Marker({
    position: coords,
    map: this.googleMap
  });
  this.markers.push(marker);

};

MapView.prototype.addMarkerOnClick = function () {
  this.googleMap.addListener('click', (event) => {
    this.addMarker(event.latLng);
    // console.log(this.markers[0].latLng());
    // console.log(this.markers[0].position.lng());
    this.calcRoute(
      { lat: this.markers[0].position.lat(),
        lng: this.markers[0].position.lng()
      },
      { lat: this.markers[1].position.lat(),
        lng: this.markers[1].position.lng()
      }
    );
  });
};

MapView.prototype.calcRoute = function(start, end) {
  const request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  };

  this.directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      console.log(this.directionsRenderer);
      this.directionsRenderer.setDirections(result);
      console.log(result);
      this.route = this.getRouteData(result);
    }
  });

};


MapView.prototype.getRouteData = function (result) {
  const routeData = result.routes[0].legs[0];
  const routeDataObject = {
    start: {lat: routeData.start_location.lat(), lng: routeData.start_location.lng()},
    end: {lat: routeData.end_location.lat(), lng: routeData.end_location.lng()},
    distance: routeData.distance.text,
    duration: routeData.duration.text
  };
  console.log(routeDataObject);
return routeDataObject;
};

module.exports = MapView;
