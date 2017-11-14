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
       
        mainVid.like = function(){
            VideoDetails.like(mainVid.video._id).then(function(data){
                if (data.data.success) {
                    mainVid.video.publishInfo.dislikes = data.data.likesAndDislikes.dislikes;
                    mainVid.video.publishInfo.likes = data.data.likesAndDislikes.likes;
                }
                // console.log(data.data)
            })
        }
        mainVid.dislike = function(){
            VideoDetails.dislike(mainVid.video._id).then(function(data){
                if (data.data.success) {
                    mainVid.video.publishInfo.dislikes = data.data.likesAndDislikes.dislikes;
                    mainVid.video.publishInfo.likes = data.data.likesAndDislikes.likes;
                }
                // console.log(data.data)
            })
        }
    })