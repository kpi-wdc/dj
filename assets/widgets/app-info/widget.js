import angular from 'angular';

angular.module('app.widgets.app-info', [])
  .controller('AppInfoController', function ($scope, APIProvider,config,author,pageSubscriptions) {

  	var addListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            return;
          }
        }
        subscriptions.push(listener);
      };
      
    var removeListener = function(listener){
        var subscriptions = pageSubscriptions();
        for (var i in subscriptions) {
          if (subscriptions[i].emitter === listener.emitter 
            && subscriptions[i].receiver === listener.receiver
            && subscriptions[i].signal === listener.signal
            && subscriptions[i].slot === listener.slot
            ) {
            subscriptions.splice(i, 1);
            return
          }
        }
      };

    $scope.visibility = true;

    new APIProvider($scope)
      .config(() => {
        $scope.author = author;
        $scope.config = config;
        
        if($scope.widget.masterWidget){
      		addListener({
                emitter:$scope.widget.masterWidget,
                receiver:  $scope.widget.instanceName,
                signal: "slaveVisibility",
                slot: "slaveVisibility"
            });
        }	
      })

      .provide("slaveVisibility", (evt, value) => {
      	 console.log("slaveVisibility",evt, value)
      	$scope.visibility = value;
      });
  });
