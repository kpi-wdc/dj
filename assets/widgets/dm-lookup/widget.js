import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-lookup', ['app.dictionary'])
  .controller('DataManagerLookupController', function ($scope, $http, EventEmitter, APIProvider, $lookup) {
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.key = $scope.key || "#WB";
        $scope.object = $lookup($scope.key);
      })
      .provide('setLookupKey', (evt, value) => {
        $scope.key = value;
        $scope.object = $lookup($scope.key);
      })
      
      .removal(() => {
        console.log('Lookup widget is destroyed');
      });
  });




