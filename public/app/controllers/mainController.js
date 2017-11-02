angular.module('mainController',['authServices'])
    .controller('mainController',function($scope,Auth,$timeout,$location){
        // Showing hiding menu
        $scope.menuVisible = false;
        $scope.showMenu = function(){
           if ($scope.menuVisible) {
            $scope.menuVisible = false;
           }else{
            $scope.menuVisible = true;
           }
        }
        // Login
        var app = this;
        app.doLogin = function(event,loginData){
            event.preventDefault();
            app.loading = true;
            app.errorMsg = false;
            Auth.login(app.loginData).then(function(data){
                if (data.data.success) {
                    app.loading = false;
                    // Success message
                    app.successMsg = data.data.message+'...redirecting to home page.';
                    // Redirect to home page with a 2 second delay
                    $timeout(function(){
                        $location.path('/');
                    },2000)
                }else{
                    app.loading = false;
                    // Error message
                    app.errorMsg = data.data.message;
                }
            })
        }
    })
   
   
    
    