angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider,$locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home-page.html'
            })
            .when('/video', {
                templateUrl: 'app/views/pages/video-page.html',
                controller: "mainVideoController" 
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });