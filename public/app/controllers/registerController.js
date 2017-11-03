angular.module('registerController',['userServices'])
.controller('registerController',function($http,$location,$timeout,User){
    var app = this;
   
    app.regUser = function(event,regData){
        event.preventDefault();
        app.loading = true;
        app.errorMsg = false;
        User.create(app.regData).then(function(data){
            if (data.data.success) {
                app.loading = false;
                // Success message
                app.successMsg = data.data.message+'...redirecting to home page.';
                // Redirect to home page with a 2 second delay
                $timeout(function(){
                    //Clearing the data for the registration form
                    app.regData = '';
                    app.successMsg = false;
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