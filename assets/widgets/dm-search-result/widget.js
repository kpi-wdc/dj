import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-search-result', ['app.dictionary'])
  .controller('DataManagerSearchResultController', function ($scope, $http, EventEmitter, 
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

    var searchDatasets = function(query){
          console.log("QUERY:", JSON.stringify(query));
          $http.post("./api/metadata/items", query).success(
            function(resp){
              console.log("RESPONSE:", resp)
              $scope.result = resp;
              $scope.total = $scope.result.length;
          });
    }

    $scope.selectSource = function(key){
      eventEmitter.emit('setLookupKey', key);
      let query = [{"dataset.source":[{equals:key}]}];
      searchDatasets(query);
    }

    $scope.selectTopic = function(key){
      eventEmitter.emit('setLookupKey', key);
      let query = [{"dataset.topics":[{includes:key}]}];
      searchDatasets(query);
    }

    $scope.lookup = $lookup;
   

    $scope.prepareTopics = function(topics){
      console.log("PREPARE",topics);
      var simple_topics = [];
      topics = (topics.forEach) ? topics : [topics];
      topics.forEach(function(item){
        item.split("/").forEach(function(t){
          if(simple_topics.filter(function(s){return s === t}).length === 0){simple_topics.push(t)}
        });
      })
      return simple_topics;
    }

     

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        $scope.query = $scope.widget.query || $scope.query;
        searchDatasets($scope.query);

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
        }     
        
      })
      .provide('searchQuery', (evt, value) => {
        searchDatasets(value);
      })
      
      .removal(() => {
        console.log('Find Result widget is destroyed');
      });
  });




