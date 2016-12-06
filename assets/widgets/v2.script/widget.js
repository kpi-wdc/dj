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

    $scope.examples = [
      {
        title:"Visualize Data",
        url:"./widgets/v2.script/scripts/sample1.dps"
      },
      {
        title:"Work with metadata",
        url:"./widgets/v2.script/scripts/metadata.dps"
      },
      {
        title:"Extend and translate",
        url:"./widgets/v2.script/scripts/translate.dps"      },
      {
        title:"Find data",
        url:"./widgets/v2.script/scripts/find_datasets.dps"
      },
      {
        title:"DJ DPS version",
        url:"./widgets/v2.script/scripts/version.dps"
      }
    ]


    $scope.getScript = function(s){
        var e = $scope.examples.filter(item => item.title == s)[0]
        if(e){
          if(e.script){
            $scope.script = e.script
          }else{
            $http
              .get(e.url)
              .then(function(resp){
                e.script = resp.data;
                $scope.script = e.script 
              })
          }
        }
    }

    $scope.selectedExample;

    $scope.$watch('selectedExample', (newValue, oldValue) => {
          console.log("SELECT",newValue,oldValue)
          if (newValue !== oldValue) {
            $scope.getScript(newValue)
          }
        });

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
        if(($scope.widget.editor && !$scope.widget.examples)){
          $scope.script = "// Write your script here ...\n"  
        }
        if(($scope.widget.editor && $scope.widget.examples)){
          $scope.script = "// Select example \n// and(or) write your script here ...\n"  
        }
        if((!$scope.widget.editor && $scope.widget.examples)){
          if($scope.selectedExample){
            $scope.selectedExample = $scope.examples[0].title;
          }else{
            $scope.script = "// Select example and run it ..."
          }
        }
        

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
        console.log('Script widget is destroyed');
      });
  })



