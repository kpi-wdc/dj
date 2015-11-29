import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-lookup', ['app.dictionary'])
  .controller('DataManagerLookupController', function ($scope, $http, EventEmitter, APIProvider, $lookup) {
    
    $scope.key = undefined; 
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        // $scope.key = $scope.key || "#WB";
        $scope.title = $scope.widget.title;
         $scope.icon_class = $scope.widget.icon_class;
        // console.log($scope.key,$lookup($scope.key));
        if($scope.key){$scope.object = $lookup($scope.key);}
      })
      .provide('setLookupKey', (evt, value) => {
        $scope.key = value;
        $scope.object = $lookup($scope.key);
      })
      
      .removal(() => {
        console.log('Lookup widget is destroyed');
      });
  });




