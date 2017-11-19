angular.module('userApp', ['appRoutes',"mainVideoController",'mainController',
'registerController','userServices','authServices','videoServices','ngAnimate',
'updateControllers','profileControllers','historyController','likedVideosController'])
.config(function($httpProvider){
    // Configuring the application to intercept all http requests with this factory which assigns tokens to the header
    $httpProvider.interceptors.push('AuthInterceptors');
});
