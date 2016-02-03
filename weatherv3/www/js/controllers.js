angular.module('starter.controllers', ['ionic'])

.constant('FORECASTIO_KEY', '76f3ef0ca4c614a2ced71001eb970aa8')


.controller('HomeCtrl', function($scope,$state,Weather,DataStore) {
    //read default settings into scope
    console.log('inside home');
    $scope.city  = DataStore.city;
    var latitude  =  DataStore.latitude;
    var longitude = DataStore.longitude;

    //some code found here: https://www.binpress.com/tutorial/a-simple-weather-forecast-app-with-ionic-framework-and-forecastio/107
    Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
      var current = resp.data;
      $scope.temperature = Math.round(current.currently.temperature) + "°F";
      $scope.apparentTemperature = Math.round(current.currently.apparentTemperature) + "°F";
      $scope.summary = current.currently.summary.toLowerCase();
      $scope.tempDif = Math.abs(Math.round(current.currently.temperature) - Math.round(current.currently.apparentTemperature));
      $scope.windSpeed = Math.round(current.currently.windSpeed);
      var intensity = current.currently.precipIntensity;

      $scope.precipIntensity = 0;
      if (intensity == 0) {
        $scope.precipIntensity = 0;
      } else if (intensity < .002) {
        $scope.precipIntensity = "very lightly";
      } else if (intensity < .017) {
        $scope.precipIntensity = "lightly";
      } else if (intensity < .1) {
        $scope.precipIntensity = "moderately hard";
      } else {
        $scope.precipIntensity = heavily;
      }
      $scope.precipProbability = current.currently.precipProbability;
      $scope.precipType = current.currently.precipType;
      $scope.nearestStormDistance = current.currently.nearestStormDistance;

      console.log('tempDif: ', $scope.tempDif);
      console.log('GOT CURRENT', current);
      //debugger;
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });

})

.controller('weekCtrl', function($scope,$state,$filter,Weather,DataStore,WeekDays) {
    //read default settings into scope
    console.log('inside weekCtrl');
    $scope.city  = DataStore.city;
    var latitude  =  DataStore.latitude;
    var longitude = DataStore.longitude;

    //call getCurrentWeather method in factory ‘Weather’
    Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
      $scope.current = resp.data;
      console.log('GOT CURRENT', $scope.current);
      theForecast();
      //debugger;
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });

    var weekDays = WeekDays;
    var today = WeekDays.getToday();
    //returns an array with info for the next 7 days
    var theForecast = function() {
      console.log('in theForecast function. value of current: ', $scope.current);
      var d = new Date();
      result = new Array(7);
      var n = today;

      $scope.barTypes = ['bar-calm', 'bar-balanced', 'bar-energized', 'bar-assertive', 'bar-royal', 'bar-dark','bar-positive', 'bar-calm', 'bar-balanced', 'bar-energized', 'bar-assertive', 'bar-royal', 'bar-dark','bar-positive'];
      $scope.barFirst = n;
      for (i = 0; i < 7; i++) {
          var ctempMax = "High: " + Math.round($scope.current.daily.data[i].temperatureMax) + "°F, ";
          var ctempMin = "Low: " + Math.round($scope.current.daily.data[i].temperatureMin) + "°F, ";
          var cweatherSummary = $scope.current.daily.data[i].summary.toLowerCase();
          
          var cday = WeekDays[n] + ",";
          var cdate = $filter('date')(d);
          result[i] = {date: cdate, tempMax: ctempMax, tempMin: ctempMin, weatherSummary:cweatherSummary, day:cday};
          
          if (n < 6) {
            n++;
          }
          else {
            n = 0;
          }
          d.setDate(d.getDate() + 1);

      };
      $scope.forecast = result;
    };
})

.controller('LocationsCtrl', function($scope,$state, Cities,DataStore) {
  $scope.cities = Cities.all();

  $scope.changeCity = function(cityId) {
    //get lat and longitude for seleted location
    var lat  = $scope.cities[cityId].lat; //latitude
    var lgn  = $scope.cities[cityId].lgn; //longitude
    var city = $scope.cities[cityId].name; //city name

    DataStore.setCity(city);
    DataStore.setLatitude(lat);
    DataStore.setLongitude(lgn);
    console.log("hopefully: city: " + city + ", lat: " + lat);
    console.log("$scope.city: " + DataStore.city);
    $state.go('tab.home');
  }
})