angular.module('profileControllers', ['videoServices'])
    .controller('profileBarController', function ($scope,Video) {

        $scope.showHome = true;
        $scope.hideHome = hideHome;
        function hideHome() {
            if ($scope.showHome == true) {
                $scope.showVideos = true;
                $scope.showHome = false;
                $scope.showPlaylist = true;
            } else {
                $scope.showHome = true;
            }
        }
        $scope.showVideos = true;
        $scope.showAllVideos = showAllVideos;
        function showAllVideos() {
            if ($scope.showVideos == true) {
                $scope.showVideos = false;
                $scope.showHome = true;
                $scope.showPlaylist = true;
            } else {
                $scope.showVideos = true;
                Video.getOwnVids().then(function(data){
                    $scope.videos = data.data;
                })
            }
        }
        $scope.showPlaylist = true;
        $scope.showPlaylists = showPlaylists;
        function showPlaylists() {
            if ($scope.showPlaylist == true) {
                $scope.showPlaylist = false;
                $scope.showVideos = true;
                $scope.showHome = true;
            } else {
                $scope.showPlaylist = true;
            }

        }
    })