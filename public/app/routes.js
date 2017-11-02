angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider,$locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home-page.html'
            })
            .when('/video', {
                templateUrl: 'app/views/pages/video-page.html',
                controller: "MainVideoController" 
            })
            .when('/register',{
                templateUrl: 'app/views/pages/register.html',
                controller: 'RegisterController'
            })
            .when('/login',{
                templateUrl: 'app/views/pages/login.html',
                controller: 'LoginController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });