import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-lookup', ['app.dictionary'])
  .controller('DataManagerLookupController', function ($scope, $http, EventEmitter, APIProvider, $lookup) {
    
    $scope.key = undefined; 
    const eventEmitter = new EventEmitter($scope);
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        // $scope.key = $scope.key || "#WB";
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        // console.log($scope.key,$lookup($scope.key));
        if($scope.key){
          $scope.object = $lookup($scope.key);
          // eventEmitter.emit("slaveVisibility",false);
        }else{
          $scope.object = undefined;
          // eventEmitter.emit("slaveVisibility",true);
        }
      })
      .provide('setLookupKey', (evt, value) => {
        $scope.key = value;
        let tmp = $lookup($scope.key);
        if($scope.key == tmp || tmp.en){
          $scope.object = undefined;
          // $scope.object = {label:$scope.key};
        }else{
          $scope.object = tmp;
        }
        if(!$scope.object){
          // eventEmitter.emit("slaveVisibility",false);
        }else{
          // eventEmitter.emit("slaveVisibility",true);
        }
      })
      
      .removal(() => {
        console.log('Lookup widget is destroyed');
      });
  });




