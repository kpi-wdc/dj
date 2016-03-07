import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.v2.dm-lookup', ['app.dictionary'])
  .controller('V2DataManagerLookupController', function ($scope, $http, EventEmitter, APIProvider, $lookup) {
    
    $scope.key = undefined; 
    $scope.visibility = true;
    const eventEmitter = new EventEmitter($scope);

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        if($scope.key){
          $scope.object = $lookup($scope.key);
        }else{
          $scope.object = undefined;
        }
      })
      .provide('setLookupKey', (evt, value) => {
        console.log("setLookupKey", value)
        if(angular.isDefined(value)){
          $scope.visibility = true;
          $scope.key = value;
          let tmp = $lookup($scope.key);
          if($scope.key == tmp || tmp.en){
            $scope.object = {label:$scope.key};
          }else{
            $scope.object = tmp;
          }
        }else{
          $scope.visibility = false;
        }
        
      })
      
      .provide("slaveVisibility", (evt, value) => {
        $scope.visibility = value;
      })
      
      .removal(() => {
        console.log('Lookup widget is destroyed');
      });
  });




