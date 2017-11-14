angular.module('videoServices',[])
.factory('Video',function($http){
    var videoFactory = {};
    //Video.getMainVids
    videoFactory.getMainVids = function(){
        return $http.get('/api/allVideos');
    }
    //Video.getVid
    videoFactory.getVid = function(name){
        return $http.get('/api/video/'+name);
    }
    //Video.getOwnVids
    videoFactory.getOwnVids = function(){
        return $http.get('/api/ownVideos')
    }
    return videoFactory;
})
.factory('VideoDetails',function($http){
    var videoDetailsFactory = {};
    // VideoDetails.like
    videoDetailsFactory.like = function(id){
        return $http.get('/api/likes/'+id);
    }
    //VideoDetails.dislike
    videoDetailsFactory.dislike = function(id){
        return $http.get('/api/dislikes/'+id);
    }
    //VideoDetails.comment
    videoDetailsFactory.comment = function(id,comment){
        return $http.post('/api/comments/'+id,comment);
    }
    return videoDetailsFactory;
})