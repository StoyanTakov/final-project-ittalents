angular.module('mainController',[])
    .controller('MainController',function($scope){
        $scope.menuVisible = false;
        $scope.showMenu = function(){
           if ($scope.menuVisible) {
            $scope.menuVisible = false;
           }else{
            $scope.menuVisible = true;
           }
        }
    })