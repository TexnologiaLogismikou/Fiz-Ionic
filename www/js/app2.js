// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        //$ionicConfigProvider.tabs.position("bottom");
        //$ionicConfigProvider.tabs.style('standard');

        //ngstompProvider
        //    .url('http://83.212.105.54:8080/chat')
        //    .class(SockJS);

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

            .state('location', {
                url: "/location",
                templateUrl: "templates/location.html",
                controller: 'GeoCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                data: {
                    requiresLogin: true
                }
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.chat', {
                url: '/chat',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/tab-chat.html',
                        controller: 'ChatCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })

            .state('tab.test', {
                url: '/test',
                views: {
                    'tab-test': {
                        templateUrl: 'templates/tab-test.html',
                        controller: 'TestCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/location');

    });

