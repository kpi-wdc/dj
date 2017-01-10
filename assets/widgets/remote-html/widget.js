import angular from 'angular';

angular.module('app.widgets.remote-html', [])
  .controller('RemoteHtmlWidgetController', function ($scope, APIProvider,
  											$translate,pageSubscriptions) {
    

    $scope.translate = $translate;
    $scope.visibility = true;
    
    function addListener(subscription) {
      var subscriptions = pageSubscriptions();
      for (var i in subscriptions) {
        if (subscriptions[i].emitter === subscription.emitter 
          && subscriptions[i].receiver === subscription.receiver) {
          return;
        }
      }
      subscriptions.push(subscription);
    };


    new APIProvider($scope)
      .config(() => {
         pageSubscriptions().removeListeners({
              receiver:  $scope.widget.instanceName,
              signal: "slaveVisibility",
        })

        if($scope.widget.masterWidget){
      		addListener({
                emitter:$scope.widget.masterWidget,
                receiver:  $scope.widget.instanceName,
                signal: "slaveVisibility",
                slot: "slaveVisibility"
            });
        }	

        $translate($scope.widget.url).then((translation) => {$scope.url = translation})
      })

      .translate(() =>{
        $translate($scope.widget.url).then((translation) => {$scope.url = translation});
      })
      
      .provide("selectLanguage", (evt, value) => {
      	$translate($scope.widget.url).then((translation) => {$scope.url = translation})
      })
      
      .provide("slaveVisibility", (evt, value) => {
      	// console.log("slaveVisibility",evt, value)
      	$scope.visibility = value;
      });
  });
