import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-tag-tree', ['app.dictionary'])
  .controller('DataManagerTagTreeController', function ($scope, $http, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate, user) {
    

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
    
    var prepareList = function(tag){
      $scope.tagList = [];
      for(let item in tag){
        if(item.indexOf("_") !==0 && item.indexOf("$") !==0){
          $scope.tagList.push(tag[item]); 
        }
      }
    }

    $scope.down = function(tag){
      $scope.breadcrums.push(tag);
      prepareList(tag);
      $scope.tag = tag;
      eventEmitter.emit('setLookupKey', tag._tag);
      let tmp = {};
      tmp["dataset.topics"] = [{startsWith:tag._path}];
      let query = [tmp];
      eventEmitter.emit('searchQuery', query);
    }

    $scope.up = function(index){
      $scope.down($scope.breadcrums.splice(index)[0]);
    }

    new APIProvider($scope)
      .config( () => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;


         $scope.lookupListeners = ($scope.widget.lookupListeners) ? $scope.widget.lookupListeners.split(",") : [];
        for(var i in $scope.lookupListeners){
          $scope.lookupListeners[i] = $scope.lookupListeners[i].trim();
          // console.log($scope.widget.instanceName,$scope.lookupListeners[i]);
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
          // console.log($scope.widget.instanceName,$scope.searchListeners[i]);
          addListener({
                emitter: $scope.widget.instanceName,
                receiver: $scope.searchListeners[i],
                signal: "searchQuery",
                slot: "searchQuery"
              });
        }  

        $scope.icon_class = $scope.widget.icon_class;
        $scope.property = $scope.widget.property || $scope.property;
         var status = (user.isOwner || user.isCollaborator) ? "private" : "public";   
          $http.post("./api/metadata/tag/tree",{"status":status})
            .success(function(resp){
              $scope.breadcrums = [];
              $scope.tagList = [];
              resp._tag = $scope.title;
              $scope.result = resp;
              $scope.breadcrums.push($scope.result);
              prepareList($scope.result);
              $scope.tag = $scope.result;
              // $scope.down($scope.result);
          })
      })    

      .provide('refresh', (evt) => {
        var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
        $http.post("./api/metadata/tag/tree",{"status":status})
          .success(function(resp){
              $scope.breadcrums = [];
              $scope.tagList = [];
              resp._tag = $scope.title;
              $scope.result = resp;
              $scope.breadcrums.push($scope.result);
              prepareList($scope.result);
              $scope.tag = $scope.result;
          })
      })
      
      .removal(() => {
        console.log('TagsTotal widget is destroyed');
      });
  });




