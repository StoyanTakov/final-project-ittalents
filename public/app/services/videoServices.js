angular.module('videoServices',[])
.factory('Video',function($http){
    var videoFactory = {};
    //Video.getMainVids
    videoFactory.getMainVids = function(){
        return $http.get('/api/allVideos');
    }
    videoFactory.getVid = function(name){
        return $http.get('/api/video/'+name);
    }
    videoFactory.getOwnVids = function(){
        return $http.get('/api/ownVideos')
    }
    videoFactory.searchVids = function(name){
        return $http.get('/searchVideos/'+name)
    }

    return videoFactory;
})