/**
 * Created by Andreas on 30/12/2015.
 */

var app = angular.module('myApp', ['ionic']);

app.controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {
    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft()
    }

});

app.controller('GeoCtrl', function ($cordovaGeolocation) {

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
        }, function (err) {
            // error
        });


    var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
        null,
        function (err) {
            // error
        },
        function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
        });


    watch.clearWatch();
    // OR
    $cordovaGeolocation.clearWatch(watch)
        .then(function (result) {
            alert("succes");
        }, function (error) {
            alert("error");
        });
});
