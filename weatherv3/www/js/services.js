'use strict';

var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY', 
  function($q, $resource, $http, FORECASTIO_KEY) {
  var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

  var weatherResource = $resource(url, {
    callback: 'JSON_CALLBACK',
  }, {
    get: {
      method: 'JSONP'
    }
  });

  return {
    //getAtLocation: function(lat, lng) {
    getCurrentWeather: function(lat, lng) {
      return $http.jsonp(url + lat + ',' + lng + '?callback=JSON_CALLBACK');
    }
  }
}];


angular.module('starter.services', ['ngResource'])

//found code for city functionality here https://www.binpress.com/tutorial/a-simple-weather-forecast-app-with-ionic-framework-and-forecastio/107

.factory('Cities', function() {
var cities = [
    { id: 0, name: 'Miami', lat:25 , lgn: 80 },
    { id: 1, name: 'New York City' ,lat: 40 , lgn: 73 },
    { id: 2, name: 'London' ,lat:51.5 , lgn: -0.13 },
    { id: 3, name: 'Los Angeles' ,lat: 34 , lgn: 118 },
    { id: 4, name: 'Dallas' ,lat: 32 , lgn:96  },
    { id: 5, name: 'Frankfurt' ,lat:50, lgn: 8 },
    { id: 6, name: 'Wenham' ,lat:43 , lgn: -71 }
  ];

  return {
    all: function() {
      return cities;
    },
    get: function(cityId) {
      // Simple index lookup
      return cities[cityId];
    }
  }
})
.factory('DataStore', function() {
    //create datastore with default values
    var DataStore = {
        city:       'Wenham',
        latitude:   42.6043,
        longitude:  -70.8912};

    DataStore.setCity = function (value) {
       DataStore.city = value;
    };

    DataStore.setLatitude = function (value) {
       DataStore.latitude = value;
    };

    DataStore.setLongitude = function (value) {
       DataStore.longitude = value;
    };

    return DataStore;
})
.factory('Weather', forecastioWeather)

.factory('WeekDays', function() {
    var WeekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    WeekDays.getToday = function (){
      //day info from w3schools info on JavaScript getDay() method
        var d = new Date();
        var day = d.getDay();
        return day;
    };
    return WeekDays;
});