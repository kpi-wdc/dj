import angular from 'angular';
import 'dictionary';
import 'ngReact';
import 'custom-react-directives';
import 'ng-prettyjson';

// console.log("REACT",React);
let m = angular.module('app.widgets.v2.script', [
  'app.dictionary',
  'app.dps',
  'ngFileUpload',
  'react',
  'custom-react-directives',
  'ngPrettyJson'])
  

  m.controller('ScriptController', function ($scope, $http, $dps, EventEmitter, 
    APIProvider, pageSubscriptions, $lookup, $translate,$modal, user, i18n, $scroll,clipboard) {
    
    const eventEmitter = new EventEmitter($scope);
    
    $scope.copyToClipboard = function(text){
      console.log("Copy", text)
      text = angular.isObject(text)? JSON.stringify(text, "\n") : text;
      console.log("text", text)
      clipboard.copyText(text);
    }

    $scope.runScript = function(){
       $scope.response = undefined;
       eventEmitter.emit('setData', undefined);
       
       $dps.post("/api/data/script",{
            "data" : $scope.script,
            "key"  : $scope.key,
            "locale": i18n.locale()
          })
        .success(function(response){
              $scope.response = response
              eventEmitter.emit('setData', response);
            })
            .error(function(response){
              $scope.response = response
            })
    }
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.d_listeners = ($scope.widget.d_listeners) ? $scope.widget.d_listeners.split(",") : [];
        pageSubscriptions().removeListeners({
          emitter: $scope.widget.instanceName,
          signal: "setData"
        })

        $scope.response = {
          message:"Write script and execute it"
        };

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

      .removal(() => {
        console.log('Find Result widget is destroyed');
      });
  })



