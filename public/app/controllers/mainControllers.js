angular.module('mainControllers',[])
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
    .controller('LoginController',function(){
        
    })
    .controller('RegisterController',function($http){

        this.regUser = function(event,regData){
            event.preventDefault();
            $http.post('/api/users',this.regData).then(function(data){
                console.log(data);
            })
            console.log(this.regData) 
        }
    })