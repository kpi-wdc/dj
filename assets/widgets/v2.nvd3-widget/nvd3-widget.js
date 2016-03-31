"use strict";

System.config({
  paths: {
    'topojson': 'widgets/v2.nvd3-widget/topojson.js',
    'nv.d3.ext': 'widgets/v2.nvd3-widget/nv.d3.ext.js',
    'angular-nvd3': 'widgets/v2.nvd3-widget/angular-nvd3-ext.js',
    "canvg": "components/canvg/dist/canvg.bundle.js",
    // "rgbcolor": "components/canvg/rgbcolor.js",
    // "stackblur": "components/canvg/StackBlur.js",
    "Blob": "components/Blob.js/Blob.js",
    "canvas-toBlob": "components/canvas-toBlob.js/canvas-toBlob.js",
    "file-saver": "components/file-saver.js/FileSaver.js"


  },
  meta: {
    'topojson': {
      exports: 'topojson'
    },
    'nv.d3.ext': {
      exports: 'nv',
      deps: ['nv.d3', 'topojson']
    },
    'angular-nvd3': {
      deps: ['nv.d3.ext']
    },
    'canvg': {
      exports: 'canvg'
      // ,
      // deps: ['rgbcolor', 'stackblur']
    },
    'file-saver': {
        deps: ['Blob','canvas-toBlob']
    }
  }
});


define(["angular", 
        "angular-oclazyload", 
        "angular-nvd3", 
        "canvg",
        "file-saver"], 

        function (angular) {



  var m = angular.module("app.widgets.v2.nvd3-widget", [
      "oc.lazyLoad", 
      "nvd3"
  ]);

  
  m.factory("NVD3WidgetV2", [ "$http",
                              "$q", 
                              "$ocLazyLoad", 
                              "APIProvider", 
                              "APIUser",
                              "i18n",
                              "parentHolder",
                              "dialog",
                              
                               
  function (  $http, 
              $q, 
              $ocLazyLoad, 
              APIProvider, 
              APIUser, 
              i18n, 
              parentHolder,
              dialog
           ) {
    
    $ocLazyLoad.load({
      files: [
        "/components/nvd3/nv.d3.css", 
        "/widgets/v2.nvd3-widget/nvd3-widget.css"
      ]
    });


    var NVD3WidgetV2 = function ($scope, params) {
      
      // console.log("create NVD3WidgetV2")

      $scope.APIProvider = new APIProvider($scope);
      $scope.APIUser = new APIUser($scope);
      $scope.decorationAdapter = params.decorationAdapter;
      $scope.settings = {};
      $scope.options;
      $scope.data;
      $scope.cashedResp;
      $scope.refreshState = {
          data:true,
          options:true
      };


      this.serieRequest = $scope.widget.serieRequest;
      var thos = this;

      $scope.completed = false;
      $scope.configured = false;

      $scope.complete = function(){
        $scope.completed = true;
      }

      $scope.process = function(){
        $scope.completed = false;
      }

      $scope.getContainerWidth = function(){
        let n = d3
            .select($scope.container.getElement()[0])
            .select("div .widget");
        let w = n.style("width")
        w = w.split("px")[0];
        let pad = n.style("padding")
        pad = pad.split(" ").map((item) => {return item.split("px")[0]})
        pad = (pad.length == 0) ? [0,0,0,0]
              : (pad.length == 1) ? [pad[0],pad[0],pad[0],pad[0]]
              : (pad.length == 2) ? [pad[0],pad[1],pad[0],pad[1]]
              : (pad.length == 3) ? [pad[0],pad[1],pad[2],pad[1]]
              : pad;

        return  w - pad[1] -pad[3];  
      }

      $scope.$watch("$scope.widget.serieDataId", function(newValue,oldValue){
        $scope.refreshState.data = newValue != oldValue;
      });


      $scope.expandOptions = (options) => {
         if($scope.widget.decoration){
                    $scope.decorationAdapter.applyDecoration(options,$scope.widget.decoration)
                  }else{
                    $scope.widget.decoration = $scope.decorationAdapter.getDecoration(options);
                  }
                  
                   for (var i in params.serieAdapter) {
                     options.chart[i] = params.serieAdapter[i];
                   }

                  options.chart.width = $scope.getContainerWidth();
                    
                  if (options.locale){
                    options.locale = i18n.locale();
                  }

                  
                  if(angular.isDefined(params.serieAdapter)){
                    if (params.serieAdapter.getX) {
                      options.chart.x = params.serieAdapter.getX;
                    }

                    if (params.serieAdapter.getY) {
                      options.chart.y = params.serieAdapter.getY;
                    }

                    options.chart.label = params.serieAdapter.getLabel;
                  }  
        return options          
      }

      $scope.updateChart = function(){
        
        if(!$scope.widget.serieDataId){
          $scope.configured = false;
          return;  
        }
        // console.log("updateChart", angular.copy($scope.options))
        $scope.configured = true;
        $scope.process();
        
        function loadOptions(){
          return $q((resolve, reject) => {
            // console.log("load Options", angular.copy($scope.options))
            if( $scope.options ){
              // console.log("Update Exists Options")
              resolve(angular.copy($scope.expandOptions($scope.options)))
              return
            }else{
               $http.get(params.optionsURL)
                .then((resp) => {
                  // console.log("Load new Options")
                  resolve(angular.copy($scope.expandOptions(resp.data)))
                  return
                })
            }
          })  
        }

        function loadData(){
          return $http.get("./api/data/process/"+$scope.widget.serieDataId)
        }

        $q.all([
            loadOptions().then( (options) =>{
                $scope.options = options;
            }),
            loadData().then( (resp) =>{
                $scope.data = (params.serieAdapter && params.serieAdapter.getSeries) ? 
                    params.serieAdapter.getSeries(resp.data.value) : resp.data.value;
            })
        ]).then( () =>{
            $scope.settings = {
                options : angular.copy($scope.options), 
                data : angular.copy($scope.data)
            }
            $scope.complete();
        });
      };

      $scope.exportImage = function(){
        dialog({
        title:"Export Widget View as png",
        fields:{
          fileName:{
            title:"File Name:", 
            type:'text', 
            value:$scope.widget.instanceName+".png", 
            editable:true, 
            required:true
          }
        }
        }).then((form) => {
          let filename = form.fields.fileName.value;
          filename = filename.split(".");
          filename = (filename.length == 1) 
                     ? (filename[0] == "") ? $scope.widget.instanceName+".png" : filename[0]+".png"
                     : (filename[filename.length-1] == "png") ? filename.join(".") : filename.join(".")+".png";

           var svg = $scope.api.getSVG();
           document.createElement('canvas')
           var c = document.createElement('canvas');   
           c.height = svg.height.baseVal.value;
           c.width = svg.width.baseVal.value;
           svg.parentNode.appendChild(c);
           d3.select(c).style("display", "none")
           canvg(c,(new XMLSerializer()).serializeToString(svg))
           c.toBlob(function(blob) {
                saveAs(blob, filename);
           });
           svg.parentNode.removeChild(c);

        });
      } 

      $scope.translate = function(){
        // console.log("TRANSLATE HANDLER", i18n.locale(), $scope.options)
        if($scope.options.chart.locale){
          $scope.options.chart.locale = i18n.locale();
          // console.log("TRANSLATE Options", i18n.locale(), $scope.options)
          $scope.settings = {
                  options : angular.copy($scope.options), 
                  data : angular.copy($scope.data)
          }
        }
      };

      $scope.APIProvider
        
        .config(function () {
          // console.log("NVD3 config",  angular.copy($scope.options))
          
          $scope.updateChart();  
        }, true)
        
        .openCustomSettings(function () {
          $scope.wizard = params.wizard;
          $scope.wizard.start($scope);
        })
        .translate(function(){
          $scope.translate();
        })
    };


    return NVD3WidgetV2;
  }]);
});
