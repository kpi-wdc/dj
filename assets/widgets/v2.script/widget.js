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
        title:"DJ DPS version",
        url:"./widgets/v2.script/scripts/version.dps"
      },
      {
        title:"Working with metadata",
        url:"./widgets/v2.script/scripts/metadata.dps"
      },
      {
        title:"Find data",
        url:"./widgets/v2.script/scripts/find_datasets.dps"
      },
      {
        title:"Extend and translate",
        url:"./widgets/v2.script/scripts/translate.dps"      
      },
      {
        title:"Get info from metadata",
        url:"./widgets/v2.script/scripts/custom-info.dps"
      },
      {
        title:"Data Cube Projection",
        url:"./widgets/v2.script/scripts/projection.dps"
      },
      {
        title:"Table Postprocessing",
        url:"./widgets/v2.script/scripts/postprocess.dps"
      },
      {
        title:"Table Analitics",
        url:"./widgets/v2.script/scripts/analitics.dps"
      },
      {
        title:"Data Normalization",
        url:"./widgets/v2.script/scripts/normalization.dps"
      },
      {
        title:"Correlation matrix",
        url:"./widgets/v2.script/scripts/corr.dps"
      },
      {
        title:"Clusters",
        url:"./widgets/v2.script/scripts/clusters.dps"
      },
      {
        title:"PCA (Scores)",
        url:"./widgets/v2.script/scripts/scores.dps"
      },
      {
        title:"PCA (Eigen Values)",
        url:"./widgets/v2.script/scripts/ev.dps"
      },
      {
        title:"Data Visualization. Vertical Bar Chart",
        url:"./widgets/v2.script/scripts/bar.dps"
      },
      {
        title:"Data Visualization. Horizontal Bar Chart",
        url:"./widgets/v2.script/scripts/hbar.dps"
      },
      {
        title:"Data Visualization. Radar Chart",
        url:"./widgets/v2.script/scripts/radar.dps"
      },
      {
        title:"Data Visualization. Line Chart",
        url:"./widgets/v2.script/scripts/sample1.dps"
      },
      {
        title:"Data Visualization. Area Chart",
        url:"./widgets/v2.script/scripts/area.dps"
      },
      {
        title:"Data Visualization. Scatter Chart",
        url:"./widgets/v2.script/scripts/scatter.dps"
      },
      {
        title:"Data Visualization. Dependency Exploration",
        url:"./widgets/v2.script/scripts/deps.dps"
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
            $scope.selectedExample = $scope.examples[0].title;
             $scope.getScript($scope.selectedExample)
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



