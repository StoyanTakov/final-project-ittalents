angular.module('likedVideosController', ['videoServices'])
.controller('likedVideosController', function (Video) {
    var app = this;
    function loadLikedVideos() {
        Video.getLikedVideos().then(function (data) {
            if (data.data) {
                app.videos = data.data;
            }
        })
    }
    loadLikedVideos();
})