angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home-page.html'
            })
            .when('/video', {
                templateUrl: 'app/views/pages/video-page.html',
                controller: "mainVideoController" 
            })
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registerController',
                controllerAs: "register"
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
            })
            .when('/upload', {
                templateUrl: 'app/views/pages/users/upload-video.html',
                controller: 'UploadVideoController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });