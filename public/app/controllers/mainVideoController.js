angular.module('mainVideoController', ['videoServices'])
    .controller('mainVideoController', function ($scope,Video,$location) {  
       var mainVid = this;
        var loadVid = function(){
            var name = $location.$$path.split('/')[2];
            console.log(name)
            Video.getVid(name).then(function(data){
                if (data.data) {
                    mainVid.video = data.data;
                    console.log(mainVid.video)
                }   
                document.getElementById('mainVideo').load();
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
    })