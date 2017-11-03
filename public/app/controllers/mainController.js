angular.module('mainController', ['authServices'])
    .controller('mainController', function ($scope, Auth, $timeout, $location, $rootScope) {
        // Showing hiding menu
        $scope.menuVisible = false;
        $scope.showMenu = function () {
            if ($scope.menuVisible) {
                $scope.menuVisible = false;
            } else {
                $scope.menuVisible = true;
            }
        }
        //Adding a variable to make the angular to load only when it's checking for the user
        //and using ng-cloak in the index.html
        $scope.loadMe = false;
        // Watching for changes in the routes when we check for the user if he is logged in
        $rootScope.$on('$routeChangeStart',function(){
         //Checking if the user is logged in and using the username
            if (Auth.isLoggedIn()) {
                Auth.getUser().then(function (data) {
                    app.isLoggedIn = true;
                    app.username = data.data.username;
                    $scope.loadMe = true;
                });
            } else {
                app.username = '';
                app.isLoggedIn = false;
                $scope.loadMe = true;
            }
        })
        // Login
        var app = this;


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
                        app.loginData = '';
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
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
                app.loggedIn = false;
            }, 1000)
        }
    })