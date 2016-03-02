import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-tag-list', ['app.dictionary'])
  .controller('DataManagerTagListController', function ($scope, $http, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate, user) {

    
    
   

    const eventEmitter = new EventEmitter($scope);
    $scope.lookup = $lookup;
    $scope.breadcrums = [];
    $scope.tagList = [];
    $scope.collapsed = true;

    $scope.changeState = function(){
      $scope.collapsed = !$scope.collapsed;      

    }

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


    $scope.selectItem = function(key){
      eventEmitter.emit('setLookupKey', key);
      let tmp = {};
      tmp[$scope.property.split(".").slice(1).join(".")] = [{includes:key}];
      let query = [tmp];
      eventEmitter.emit('searchQuery', query);
    }

    $scope.refresh = function(){
          var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
          status = "public";
          // $http.post(
          //     "./api/metadata/tag/total",
          //     {property : $scope.property,"status":status}
          //    ).success(function(resp){
          //     $scope.total = resp.count;
          // });

          $http.post(
            "./api/metadata/tag/items",
            {property : $scope.property,"status":status}
           ).success(function(resp){
            $scope.total = resp.length;
            resp.forEach(function(item){
              item.lookup = $lookup(item.tag)
            }); 
            $scope.tagList = resp;
          });
    }

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.icon_class = $scope.widget.icon_class;
        $scope.property = $scope.widget.property || $scope.property;

        $scope.lookupListeners = ($scope.widget.lookupListeners) ? $scope.widget.lookupListeners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setLookupKey"
        })

        pageSubscriptions().addListeners(
          $scope.lookupListeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setLookupKey",
                slot: "setLookupKey"
            }
          })
        );


        // for(var i in $scope.lookupListeners){
        //   $scope.lookupListeners[i] = $scope.lookupListeners[i].trim();
        //   console.log($scope.widget.instanceName,$scope.lookupListeners[i]);
        //   addListener({
        //         emitter: $scope.widget.instanceName,
        //         receiver: $scope.lookupListeners[i],
        //         signal: "setLookupKey",
        //         slot: "setLookupKey"
        //       });
        // }

        $scope.searchListeners = ($scope.widget.searchListeners) ? $scope.widget.searchListeners.split(",") : [];

        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "searchQuery"
        })

        pageSubscriptions().addListeners(
          $scope.searchListeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "searchQuery",
                slot: "searchQuery"
            }
          })
        );        
        
        // for(var i in $scope.searchListeners){
        //   $scope.searchListeners[i] = $scope.searchListeners[i].trim();
        //   console.log($scope.widget.instanceName,$scope.searchListeners[i]);
        //   addListener({
        //         emitter: $scope.widget.instanceName,
        //         receiver: $scope.searchListeners[i],
        //         signal: "searchQuery",
        //         slot: "searchQuery"
        //       });
        // }  
           
          // $http.post(
          //     "./api/metadata/tag/total",
          //     {property : $scope.property}
          //    ).success(function(resp){
          //     $scope.total = resp.count;
          // });

          // $http.post(
          //   "./api/metadata/tag/items",
          //   {property : $scope.property}
          //  ).success(function(resp){
          //   resp.forEach(function(item){
          //     item.lookup = $lookup(item.tag)
          //   }); 
          //   $scope.tagList = resp;
          // });
          $scope.refresh();
        })
      .provide('refresh', (evt) => {
        $scope.refresh();
      })
      
      .removal(() => {
        console.log('TagsTotal widget is destroyed');
      });
  });




