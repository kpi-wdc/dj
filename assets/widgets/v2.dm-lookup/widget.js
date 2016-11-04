import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.v2.dm-lookup', ['app.dictionary'])
  .controller('V2DataManagerLookupController', function ($scope, 
    $http, 
    EventEmitter, 
    APIProvider, 
    $lookup,
    $scroll) {
    
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
      .provide('setLookupKey', (evt, value, cat) => {
        console.log("setLookupKey", value, cat)
        if(angular.isDefined(value)){
          $scope.fml = false;
          $scope.visibility = true;

          $scroll($scope.widget.instanceName)
          
          $scope.key = value;
          let tmp = $lookup($scope.key);
          if($scope.key == tmp || tmp.en){
            $scope.object = {label:$scope.key, category:cat};
            $scope.meta = [];
          }else{
            $scope.object = tmp;
            $scope.object.category = cat;
            $scope.object.label = $scope.object.label || $scope.object["Short Name"] 
            $scope.meta = [];
            var keys = Object.keys($scope.object);
            for(var i=0; i<keys.length;i++){
              $scope.meta.push({key:keys[i], value:$scope.object[keys[i]]})
            }
            // console.log($scope.meta)
          }
        }else{
          $scope.meta = [];
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




