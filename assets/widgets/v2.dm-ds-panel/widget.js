import angular from 'angular';
import 'dictionary';
import 'ngReact';
import 'custom-react-directives';

// console.log("REACT",React);
let m = angular.module('app.widgets.v2.dm-ds-panel', ['app.dictionary','app.dps','ngFileUpload','react','custom-react-directives'])
  m.controller('DataManagerSearchResultController', function ($scope, $http, $dps, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate,$modal, user, i18n) {
    

    const eventEmitter = new EventEmitter($scope);
    $scope.lookup = $lookup;
    $scope.total = 0;
    $scope.key = undefined; 
    $scope.formatDate = i18n.formatDate;

    var searchDatasets = function(query){

          if(query){
            
            $scope.total = 0;
            $scope.query = query;
            var status = "public";//(user.isOwner || user.isCollaborator) ? "private" : "public";
            // $http.post("./api/metadata/items", {"query":query, "status":status})
            $dps.post("/api/metadata/items", {"query":query, "status":status})
            .success(
              function(resp){
                $scope.result = resp;

                if(!$scope.result.forEach){
                  $scope.query = undefined;
                  eventEmitter.emit("slaveVisibility",true);
                  return;
                } 
                $scope.result.forEach((item) => {item.collapsed=false});
                $scope.total = $scope.result.length;
                if(resp.length == 0){
                   eventEmitter.emit("slaveVisibility",true);
                 }else{
                   eventEmitter.emit("slaveVisibility",false);
                 }
            });
          }
    }

    $scope.lookup = $lookup;

   
    $scope.select = function(ds){
          if($scope.selection) $scope.selection.selected = false;
          ds.selected = true;
          $scope.selection = ds; 
          eventEmitter.emit("setDataSet",ds);
    }

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.layout = $scope.widget.layout || "panel"; 

        if($scope.key){
          $scope.object = $lookup($scope.key);
        }else{
          $scope.object = undefined;
        }

        $scope.listeners = ($scope.widget.listeners) ? $scope.widget.listeners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setLookupKey"
        })

        pageSubscriptions().addListeners(
          $scope.listeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setLookupKey",
                slot: "setLookupKey"
            }
          })

        );
        

        $scope.rlisteners = ($scope.widget.rlisteners) ? $scope.widget.rlisteners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "refresh"
        })
        
        pageSubscriptions().addListeners(
          $scope.rlisteners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "refresh",
                slot: "refresh"
            }
          })
        );

        $scope.dslisteners = ($scope.widget.dslisteners) ? $scope.widget.dslisteners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setDataSet"
        })

        pageSubscriptions().addListeners(
          $scope.dslisteners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setDataSet",
                slot: "setDataSet"
            }
          })
        );
        
        if($scope.total == 0){
          eventEmitter.emit("slaveVisibility",true);
        }else{
          eventEmitter.emit("slaveVisibility",false);
        }
        
      })

      .provide('searchQuery', (evt, value) => {
        // console.log('searchQuery', value);


        $scope.query = value;
        if(!$scope.query) return;
        searchDatasets(value);
        // console.log('send setDataSet', value);
        eventEmitter.emit("setDataSet",undefined);
        // console.log('after send setDataSet', value);
      })
      .provide('refresh', (evt) => {
        searchDatasets($scope.query);
      })
      .translate(() => {  eventEmitter.emit("slaveVisibility", $scope.total == 0 )})

      .removal(() => {
        console.log('Find Result widget is destroyed');
      });
  })

