angular.module('mainVideoController', ['videoServices'])
    .controller('mainVideoController', function ($scope,Video,$location,VideoDetails) {  
       var mainVid = this;
       var path =  $location.$$path;
        var loadVid = function(){
            var name = path.split('/')[2];
            Video.getVid(name).then(function(data){
                if (data.data) {
                    mainVid.video = data.data;
                }   
                document.getElementById('mainVideo').load();
                VideoDetails.view(mainVid.video._id).then(function(data){
                    if (data.data.success) {
                        mainVid.video.publishInfo.views = data.data.views;
                    }
                })
            })
        }();
       
        $scope.showDescription = true;
        $scope.showInfoText = "Show";
        $scope.showInfo = showInfo;
        function showInfo() {
            if ($scope.showDescription == true) {
                $scope.showInfoText = "Hide";
                $scope.showDescription = false;
            } else {
                $scope.showInfoText = "Show";
                $scope.showDescription = true;
            }
        }
        $scope.shareMenu = true;
        $scope.showShareMenu = showShareMenu;
        function showShareMenu() {
            if ($scope.shareMenu == true) {             
                $scope.shareMenu = false;
            } else {
                $scope.shareMenu = true;
            }
        }
       // Like button functionality
        mainVid.like = function(){
            VideoDetails.like(mainVid.video._id).then(function(data){
                if (data.data.success) {
                    mainVid.video.publishInfo.dislikes = data.data.likesAndDislikes.dislikes;
                    mainVid.video.publishInfo.likes = data.data.likesAndDislikes.likes;
                }else{
                    if (data.data.success == false) {
                        alert(data.data.message);
                    }
                }

            })
        }
        // Dislike button functionality
        mainVid.dislike = function(){
            VideoDetails.dislike(mainVid.video._id).then(function(data){
                if (data.data.success) {
                    mainVid.video.publishInfo.dislikes = data.data.likesAndDislikes.dislikes;
                    mainVid.video.publishInfo.likes = data.data.likesAndDislikes.likes;
                }else{
                    if (data.data.success == false) {
                        alert(data.data.message);
                    }
                }
            })
        }
        // Comment functionality
        mainVid.commentUp = function(){
            var comment = {
                comment: mainVid.commentInput,
                time: new Date().toJSON().slice(0,10).replace(/-/g,'/')
            }
            VideoDetails.comment(mainVid.video._id,comment).then(function(data){
                if (data.data.success==false) {
                    alert(data.data.message);
                }else{
                    mainVid.video.comments = data.data;
                    mainVid.commentInput = '';
                }
            });
        }
    })