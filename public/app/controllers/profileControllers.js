angular.module('profileControllers', [])
    .controller('profileBarController', function ($scope) {

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