var app = angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home-page.html',
                // authenticated: false
            })
            .when('/search', {
                templateUrl: 'app/views/pages/search-page.html',
                // authenticated: false
            })
            .when('/history',{
                templateUrl: 'app/views/pages/history.html',
                controller: 'historyController',
                controllerAs: 'history'
                // authenticated: true
            })
            .when('/likedVideos',{
                templateUrl: 'app/views/pages/liked-videos.html',
                controller: 'likedVideosController',
                controllerAs: 'likedVids'
                // authenticated: true
            })
            .when('/video/:name', {
                templateUrl: 'app/views/pages/video-page.html',
                controller: "mainVideoController",
                controllerAs: 'mainVid'
                // authenticated: false
            })
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'registerController',
                controllerAs: "register",
                // authenticated: false
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
            .when('/profile', {
                templateUrl: 'app/views/pages/users/profile.html',
                controller: 'profileBarController',
                // authenticated: true
            })
            .when('/upload', {
                templateUrl: 'app/views/pages/users/upload-video.html',
                controller: 'uploadVideoController',
                controllerAs: 'up',
                // authenticated: true
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                // authenticated: true
            })
            .when('/facebook/:token', {
                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'facebookController',
                controllerAs: 'facebook',
                // authenticated: false
            })
            .when('/facebookerror', {
                templateUrl: 'app/view/pages/users/login.html',
                controller: 'facebookController',
                controllerAs: 'facebook',
                // authenticated: false
            })
            .when('/google/:token', {
                templateUrl: 'app/views/pages/users/social/social.html',
                controller: 'googleController',
                controllerAs: 'google',
                // authenticated: false
            })
            .when('/googleerror', {
                templateUrl: 'app/view/pages/users/login.html',
                controller: 'googleController',
                controllerAs: 'google',
                // authenticated: false
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });
//Restricting routes if you are logged in or not while using an additional variable 'authenticated' in every route
// app.run(['$rootScope','Auth','$location', function ($rootScope, Auth,$location) {
//     $rootScope.$on('$routeChangeStart' , function (event, next, current) {
//        if (next.$$route.authenticated==true) {
//            if (!Auth.isLoggedIn()) {
//                event.preventDefault();
//                $location.path('/');
//            }
//        }else{
//            if (next.$$route.authenticated==false) {
//                if (Auth.isLoggedIn()) {
//                    event.preventDefault();
//                    $location.path('/');
//                }
//            }
//        }
//     })
// }])