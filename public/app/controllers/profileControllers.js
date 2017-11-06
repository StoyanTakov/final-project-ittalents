angular.module('profileControllers', [])
    .controller('profileBarController', function ($scope) {

        $scope.showHome = false;
        $scope.hideHome = hideHome;
        function hideHome() {
            if ($scope.showHome == false) {
                $scope.showHome = true;
            } else {
                $scope.showHome = false;
            }
        }
        $scope.showVideos = true;
        $scope.showAllVideos = showAllVideos;
        function showAllVideos() {
            if ($scope.showVideos == true) {
                $scope.showVideos = false;
            } else {
                $scope.showVideos = true;
            }
        }
        $scope.showPlaylist = true;
        $scope.showPlaylists = showPlaylists;
        function showPlaylists() {
            if ($scope.showPlaylist == true) {
                $scope.showPlaylist = false;
            } else {
                $scope.showPlaylist = true;
            }

        }
    })