import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

angular.module('app.widgets.dm-key-emitter', [])
  .controller('DataManagerKeyEmmiterController', function ($scope, $http, EventEmitter, 
    APIProvider, APIUser, pageSubscriptions) {
  

    const eventEmitter = new EventEmitter($scope);
    // For direct slot invocation
    // inject APIUser and use the following code
    var apiUser = new APIUser($scope);
    // apiUser.invoke('widgetName', 'slotName', args...)
    // 
    function addListener(subscription) {
      var subscriptions = pageSubscriptions();
      for (var i in subscriptions) {
        if (subscriptions[i].emitter === subscription.emitter 
          && subscriptions[i].receiver === subscription.receiver) {
          return;
        }
      }
      console.log("SUBSCRIPT",subscription);
      subscriptions.push(subscription);
    };

    function removeListener(subscription) {
      var subscriptions = pageSubscriptions();
      for (var i in subscriptions) {
        if (subscriptions[i].emitter === subscription.emitter 
          && subscriptions[i].receiver === subscription.receiver) {
          subscriptions.splice(i, 1);
          return;
        }
      }
    };

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);

        $scope.listeners = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
        
        for(var i in $scope.listeners){
          $scope.listeners[i] = $scope.listeners[i].trim();
          console.log($scope.widget.instanceName,$scope.listeners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.listeners[i],
                signal: "setLookupKey",
                slot: "setLookupKey"
              });
          // apiUser.invoke($scope.l[i], "setLookupKey", $scope.key);
        }

        eventEmitter.emit('setLookupKey', $scope.key);

      })
      
      //.openCustomSettings(() => {
      //    console.log('Opening custom settings...');
      //})
      .removal(() => {
        console.log('KeyEmmiter widget is destroyed');
      });

    $scope.$watch('key', (newValue) => {
      console.log("WATCH", newValue);
      eventEmitter.emit('setLookupKey', newValue);
      // for(var i in $scope.l){
      //     console.log($scope.l[i], newValue);
      //     apiUser.invoke($scope.l[i], "setLookupKey", newValue);
      // }

    });
  });
