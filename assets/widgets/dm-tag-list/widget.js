import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-tag-list', ['app.dictionary'])
  .controller('DataManagerTagListController', function ($scope, $http, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate) {
    

    const eventEmitter = new EventEmitter($scope);
    $scope.lookup = $lookup;
    $scope.breadcrums = [];
    $scope.tagList = [];

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

    $scope.selectItem = function(key){
      eventEmitter.emit('setLookupKey', key);
      let tmp = {};
      tmp[$scope.property.split(".").slice(1).join(".")] = [{includes:key}];
      let query = [tmp];
      eventEmitter.emit('searchQuery', query);
    }

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        $scope.property = $scope.widget.property || $scope.property;

        $scope.lookupListeners = ($scope.widget.lookupListeners) ? $scope.widget.lookupListeners.split(",") : [];
        for(var i in $scope.lookupListeners){
          $scope.lookupListeners[i] = $scope.lookupListeners[i].trim();
          console.log($scope.widget.instanceName,$scope.lookupListeners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.lookupListeners[i],
                signal: "setLookupKey",
                slot: "setLookupKey"
              });
        }

        $scope.searchListeners = ($scope.widget.searchListeners) ? $scope.widget.searchListeners.split(",") : [];
        for(var i in $scope.searchListeners){
          $scope.searchListeners[i] = $scope.searchListeners[i].trim();
          console.log($scope.widget.instanceName,$scope.searchListeners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.searchListeners[i],
                signal: "searchQuery",
                slot: "searchQuery"
              });
        }  
           
          $http.post(
              "./api/metadata/tag/total",
              {property : $scope.property}
             ).success(function(resp){
              $scope.total = resp.count;
          });

          $http.post(
            "./api/metadata/tag/items",
            {property : $scope.property}
           ).success(function(resp){
            resp.forEach(function(item){
              item.lookup = $lookup(item.tag)
            }); 
            $scope.tagList = resp;
          });
        })
      .provide('refresh', (evt) => {
        $http.post(
            "./api/metadata/tag/items",
            {property : $scope.property}
           ).success(function(resp){
            $scope.tagList = resp;
          });
      })
      
      .removal(() => {
        console.log('TagsTotal widget is destroyed');
      });
  });




