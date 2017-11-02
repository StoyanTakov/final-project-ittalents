angular.module('videoControllers', [])
    .controller('MainVideoController', function ($scope) {
        var video = {
            id: "7lCDEYXw3mM",
            snippet: {
                publishedAt: "2012-06-20T22:45:24.000Z",
                channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
                title: "Google I/O 101: Q&A On Using Google APIs",
                description: "Antonio Fuentes speaks to us and takes questions on working with Google APIs and OAuth 2.0.",
                thumbnails: {
                    default: {
                        url: "https://i.ytimg.com/vi/7lCDEYXw3mM/default.jpg"
                    },
                    medium: {
                        url: "https://i.ytimg.com/vi/7lCDEYXw3mM/mqdefault.jpg"
                    },
                    high: {
                        url: "https://i.ytimg.com/vi/7lCDEYXw3mM/hqdefault.jpg"
                    }
                },
                categoryId: "28"
            },
            statistics: {
                viewCount: "3057",
                likeCount: "25",
                dislikeCount: "0",
                favoriteCount: "17",
                commentCount: "12"
            }
        }
        $scope.video = video;
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