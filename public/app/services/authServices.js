angular.module('authServices',[])

.factory('Auth',function($http,$window,AuthToken,$location,$timeout){
    var authFactory = {};
    // Auth.login(loginData)
    authFactory.login = function(loginData){
        return $http.post('/api/authenticate',loginData).then(function(data){
            AuthToken.setToken(data.data.token);
            return data;
        });
    }
    // Auth.isLoggedIn()
    authFactory.isLoggedIn = function(){
        if (AuthToken.getToken()) {
            return true;
        }else{
            return false;
        }
    }
    // Auth.getUser()
    authFactory.getUser = function(){
        if (AuthToken.getToken()) {
            return $http.post('/api/me')
        }else{
            $q.reject({ message: 'User has no token.'})
        }
    }

    //Auth.logout()
    authFactory.logout = function(){
        AuthToken.setToken();
    };

    return authFactory;
})

.factory('AuthToken', function($window){
    var authTokenFactory = {};

    // AuthToken.setToken(token)
    // Setting a token in if there isn't one, or removing it if there is
    authTokenFactory.setToken = function(token){
        if (token) {
            $window.localStorage.setItem('token',token);
        }else{
            $window.localStorage.removeItem('token',token);
        }
        
    }
    // AuthToken.getToken()
    //Getting the token from the localStorage
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
})
//Creating another factory because we need to attach a token on every request
.factory('AuthInterceptors',function(AuthToken){
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    }

    return authInterceptorsFactory;
})