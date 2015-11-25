import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

angular.module('app.widgets.dm-key-emitter', [])
  .controller('DataManagerKeyEmmiterController', function ($scope, $http, EventEmitter, APIProvider, APIUser) {
  

    const eventEmitter = new EventEmitter($scope);
    // For direct slot invocation
    // inject APIUser and use the following code
    var apiUser = new APIUser($scope);
    // apiUser.invoke('widgetName', 'slotName', args...)

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        console.log($scope.widget);
        $scope.l = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
        
        for(var i in $scope.l){
          $scope.l[i] = $scope.l[i].trim();
          console.log($scope.l[i], $scope.key)
          // apiUser.invoke($scope.l[i], "setLookupKey", $scope.key);
        }

      })
      
      //.openCustomSettings(() => {
      //    console.log('Opening custom settings...');
      //})
      .removal(() => {
        console.log('KeyEmmiter widget is destroyed');
      });

    $scope.$watch('key', (newValue) => {
      console.log("WATCH", newValue);
      // eventEmitter.emit('setLookupKey', newValue);
      for(var i in $scope.l){
          console.log($scope.l[i], newValue);
          apiUser.invoke($scope.l[i], "setLookupKey", newValue);
      }

    });
  });
