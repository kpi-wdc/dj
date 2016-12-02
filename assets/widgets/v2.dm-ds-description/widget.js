import angular from 'angular';
import 'dictionary';
import 'ngReact';
import 'custom-react-directives';

// console.log("REACT",React);
let m = angular.module('app.widgets.v2.dm-ds-description', ['app.dictionary','app.dps','ngFileUpload','react','custom-react-directives'])
  m.controller('DataManagerDSInfoController', function ($scope, $http, $dps, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate,$modal, user, i18n, $scroll) {
    

    const eventEmitter = new EventEmitter($scope);
    $scope.lookup = $lookup;
    $scope.tagList = [];
    $scope.key = undefined; 



    
    var applyContext = function(template, context){
      var getContextValue = function(){
          var tags =arguments[1].split(".")
          var value = context;
          tags.forEach(function(tag){
            tag = tag.trim();
            value = value[tag] 
          })

          return value
      }
      return template.replace(/(?:\{\{\s*)([a-zA-Z0-9_\.]*)(?:\s*\}\})/gim, getContextValue)
    }



   
    $scope.formatDate = i18n.formatDate;
    $scope.dps = $dps;
    
    $scope.download = function(item){
      item.download = true;
     // $http.get("./api/dataset/download/"+item.dataset.id)
      $dps.get("/api/dataset/download/"+item.dataset.id)
        .success(function(){
          item.download = false;
        })
    }

    $scope.selectSource = function(key){
      console.log("Select Source")
      eventEmitter.emit('setLookupKey', key,"#Datasource");
      // let query = [{"dataset.source":[{equals:key}]}];
      let query = "$[?(@.dataset.source=='{{}}')]".split("{{}}").join(key);
      eventEmitter.emit('searchQuery', query);
    }

    $scope.selectTopic = function(key){
      console.log("Select Topic")
      eventEmitter.emit('setLookupKey', key, "#Topic");
      // let query = [{"dataset.topics":[{includes:key}]}];
      let query = "$[?(@.dataset.topics.contains(function(d){return d.startWith('{{}}')}))]".split("{{}}").join(key);
      eventEmitter.emit('searchQuery', query);
    }

    
    $scope.lookup = $lookup;
   

    var prepareTopics = function(topics){
      var simple_topics = [];
      topics = (topics.forEach) ? topics : [topics];
      topics.forEach(function(item){
        item.split("/").forEach(function(t){
          if(simple_topics.filter(function(s){return s === t}).length === 0){simple_topics.push(t)}
        });
      })
      return simple_topics;
    }

    $scope.prepareTopics = prepareTopics;

    var downloadSamples = function(metadata){
      if(metadata.dataset.preview){
        for(var key in metadata.dataset.preview){
          console.log("Inspect samples for "+key+": "+applyContext(metadata.dataset.preview[key],metadata))
          $dps.post("/api/data/script",{
            "data" : applyContext(metadata.dataset.preview[key],metadata),
            "key"  :key,
            "locale": i18n.locale()
          })
            .success(function(response){
              console.log(response.key+" RESPONSE ", response.data)
              response.dataset = metadata.dataset.id
              eventEmitter.emit('setData', response);
            })
            .error(function(response){
              console.log("ERROR", response)
            })
        }
      }else{
        eventEmitter.emit('setData', undefined);
      }
      

    } 

    
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        
        $scope.s_listeners = ($scope.widget.s_listeners) ? $scope.widget.s_listeners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "searchQuery"
        })

        pageSubscriptions().addListeners(
          $scope.s_listeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "searchQuery",
                slot: "searchQuery"
            }
          })
        );
        

        $scope.l_listeners = ($scope.widget.l_listeners) ? $scope.widget.l_listeners.split(",") : [];
        
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setLookupKey"
        })
        
        pageSubscriptions().addListeners(
          $scope.l_listeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setLookupKey",
                slot: "setLookupKey"
            }
          })
        );

        
        $scope.d_listeners = ($scope.widget.d_listeners) ? $scope.widget.d_listeners.split(",") : [];
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setData"
        })

        pageSubscriptions().addListeners(
          $scope.d_listeners.map((item) =>{
            return {
                emitter: $scope.widget.instanceName,
                receiver: item.trim(),
                signal: "setData",
                slot: "setData"
            }
          })
        );
        
        
         eventEmitter.emit('setData', undefined);
      })

      .provide('setDataSet', (evt, value) => {
        console.log("getDataSet", value)
        eventEmitter.emit('setData', undefined);
        $scope.ds = value;
        if($scope.ds){
          eventEmitter.emit('setLookupKey', undefined);
          eventEmitter.emit('searchQuery', undefined);
          
          
          $scope.topics = prepareTopics($scope.ds.dataset.topics);
          $scope.ds.dataset.$periodicity = $translate.instant('WIDGET.V2.DM-DS-DESCRIPTION.'+$scope.ds.dataset.periodicity); 
          $scroll($scope)
          downloadSamples($scope.ds);
        }  
      })

      .translate(() => { 
        if($scope.ds)
        $scope.ds.dataset.$periodicity = $translate.instant('WIDGET.V2.DM-DS-DESCRIPTION.'+$scope.ds.dataset.periodicity); 
      })

      .removal(() => {
        console.log('Find Result widget is destroyed');
      });
  })



