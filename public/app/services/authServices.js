angular.module('authServices',[])

.factory('Auth',function($http){
    var authFactory = {};

    authFactory.login = function(loginData){
        return $http.post('/api/authenticate',loginData);
    }

    return authFactory;
})

.factory('AuthToken', function(){
    
})