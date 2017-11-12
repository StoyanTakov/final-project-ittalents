angular.module('mainController', ['authServices', 'videoServices'])
    .controller('mainController', function ($scope, Video, Auth, $timeout, $location, $rootScope, $window) {
        // Showing hiding menu
        var app = this;
        $scope.menuVisible = false;
        $scope.showMenu = function () {
            if ($scope.menuVisible) {
                $scope.menuVisible = false;
            } else {
                $scope.menuVisible = true;
            }
        }
        $scope.loadMainVids = function () {
            if (app.isSearching) {
                $location.path('/')
                app.isSearching = false;
                app.searchedVids = [];
                app.videos = data.data;
            } else {
                Video.getMainVids().then(function (data) {
                    if (data.data) {
                        app.videos = data.data;
                    }
                })
            }
        };
        $scope.loadMainVids();
        app.searchByTitle = function (searchTitle) {
            Video.searchVids(searchTitle).then(function (data) {
                isSearching = true;
                if (data.data) {
                    app.videos = [];
                    app.searchedVids = data.data;
                    console.log(data);
                }
            })
        }
        // //Adding a variable to make the angular to load only when it's checking for the user
        // //and using ng-cloak in the index.html
        // $scope.loadMe = false;
        // Watching for changes in the routes when we check for the user if he is logged in
        $rootScope.$on('$routeChangeStart', function () {
            //Checking if the user is logged in and using the username
            if (Auth.isLoggedIn()) {
                Auth.getUser().then(function (data) {
                    app.isLoggedIn = true;
                    app.username = data.data.username;
                    // $scope.loadMe = true;
                });
            } else {
                app.isLoggedIn = false;
                // $scope.loadMe = true;
            }
            if ($location.hash() == '_=_') { //Removing the additional url signs from facebook
                $location.hash(null);
            }
        })
        // Login


        app.google = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
        }
        app.facebook = function () {
            // http:                             //localhost:8080
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
        }
        //Login function
        app.doLogin = function (event, loginData) {
            event.preventDefault();
            app.loading = true;
            app.errorMsg = false;
            Auth.login(app.loginData).then(function (data) {
                if (data.data.success) {
                    app.loading = false;
                    // Success message
                    app.successMsg = data.data.message + '...redirecting to home page.';
                    // Redirect to home page with a delay
                    $timeout(function () {
                        //Clearing the data for the login form
                        app.successMsg = false;
                        app.loginData = {};
                        $location.path('/');
                        app.loggedIn = true;
                    }, 1000)
                } else {
                    app.loading = false;
                    // Error message
                    app.errorMsg = data.data.message;
                }
            })
        }
        //Logging out function with a delay and redirection to the main page
        app.logout = function () {
            Auth.logout();
            // app.fbLogout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
                app.loggedIn = false;
            }, 1000)
        }
    })