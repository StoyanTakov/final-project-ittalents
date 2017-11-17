angular.module('historyController', ['videoServices'])
    .controller('historyController', function (Video) {
        var app = this;
        function loadHistoryVids() {
            Video.getHistory().then(function (data) {
                if (data.data) {
                    app.videos = data.data;
                }
            })
        }
        loadHistoryVids();
    })