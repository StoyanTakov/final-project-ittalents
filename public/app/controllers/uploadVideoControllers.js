angular.module('updateControllers', ['ngFileUpload'])
    .controller('uploadVideoController', function (Upload, $window,$http,$scope,$rootScope) {
        var self = this;
        self.submit = function () { //function to call on form submit
            if (self.upload_form.file.$valid && (self.file)) { //check if from is valid
                self.upload(self.file); //call upload function
            }
        }
        self.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:8080/api/uploads/', //webAPI exposed to upload the file
                data: { file: file , 'title':self.title,'description':self.description,'tags':self.tags,
                'categories':self.categories,'time': new Date().toJSON().slice(0,10).replace(/-/g,'/')} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if (resp.data.error_code === 0) { //validate success
                    $window.alert('Success ' + resp.config.data.file.name + ' uploaded.');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                // console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                self.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    });
