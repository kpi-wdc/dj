"use strict";

System.config({
  paths: {
    'topojson': 'widgets/v2.nvd3-widget/topojson.js',
    'nv.d3.ext': 'widgets/v2.nvd3-widget/nv.d3.ext.js',
    'angular-nvd3': 'widgets/v2.nvd3-widget/angular-nvd3-ext.js',
    "dps" : "widgets/data-util/dps.js"
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
    }
  }
});


define(["angular", "angular-oclazyload", "angular-nvd3", "dps"], function (angular) {


  var m = angular.module("app.widgets.v2.nvd3-widget", ["oc.lazyLoad", "nvd3",  "app.widgets.data-util.dps"]);


  m.factory("NVD3WidgetV2", [ "$http", 
                              "$ocLazyLoad", 
                              "APIProvider", 
                              "APIUser",
                              "Requestor", 
                               
  function ($http, $ocLazyLoad, APIProvider, APIUser, Requestor) {
    
    $ocLazyLoad.load({
      files: [
        "/components/nvd3/nv.d3.css", 
        "/widgets/v2.nvd3-widget/nvd3-widget.css"
      ]
    });

    var NVD3WidgetV2 = function ($scope, params) {
      
      $scope.APIProvider = new APIProvider($scope);
      $scope.APIUser = new APIUser($scope);
      $scope.decorationAdapter = params.decorationAdapter;
      $scope.settings = {};
      $scope.options;
      $scope.data;
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

      $scope.updateChart = function(){
        if($scope.widget.serieRequest){
          $scope.configured = true;
          $scope.process();
          new Requestor()
            .push("getOptions",function(requestor){
              if(angular.isDefined($scope.options)){
                if($scope.widget.decoration){
                  $scope.decorationAdapter.applyDecoration($scope.options,$scope.widget.decoration)
                }else{
                  $scope.widget.decoration = $scope.decorationAdapter.getDecoration($scope.options);
                }
                requestor.resolve()
              }else{
                console.log("options", params.optionsURL)
                $http.get(params.optionsURL)
                .success(function(data){
                   $scope.options = data;


                   for (var i in params.serieAdapter) {
                      $scope.options.chart[i] = params.serieAdapter[i];
                   }

                    
                  if($scope.widget.decoration){
                    $scope.decorationAdapter.applyDecoration($scope.options,$scope.widget.decoration)
                  }else{
                    $scope.widget.decoration = $scope.decorationAdapter.getDecoration($scope.options);
                  }
                  if(angular.isDefined(params.serieAdapter)){
                    if (params.serieAdapter.getX) {
                      $scope.options.chart.x = params.serieAdapter.getX;
                    }

                    if (params.serieAdapter.getY) {
                      $scope.options.chart.y = params.serieAdapter.getY;
                    }

                    $scope.options.chart.label = params.serieAdapter.getLabel;

                    if ($scope.options.chart.scatter) {
                      $scope.options.chart.scatter.label = params.serieAdapter.getLabel;
                    }
                    if ($scope.options.chart.lines) {
                      $scope.options.chart.lines.label = params.serieAdapter.getLabel;
                    }
                    if ($scope.options.chart.stacked && angular.isObject($scope.options.chart.stacked)) {

                      $scope.options.chart.stacked.label = params.serieAdapter.getLabel;
                    }
                  }   
                  requestor.resolve();
                })
              }                  
            })
            .push("generateSeries",function(requestor){
              if(angular.isUndefined($scope.data) || thos.serieRequest!= $scope.widget.serieRequest){
                thos.serieRequest = $scope.widget.serieRequest;
                $http
                .post("./api/data/process/",
                  $scope.widget.serieRequest    
                )
                .success(function (data) {
                    $scope.data = (params.serieAdapter.getSeries) ? params.serieAdapter.getSeries(data.data) : data.data;
                    requestor.resolve()
                })
              }else{
                $scope.configured = false;
                requestor.resolve();
              }  
             })
            .execute(this.queryResultId,function(){
              $scope.settings = {
                options : angular.copy($scope.options), 
                data : angular.copy($scope.data)
              }
              $scope.complete();
             });
          } 
      };

      
      // $scope.updateChart(); 

      $scope.APIProvider
        
        .config(function () {
          $scope.updateChart();  
        }, true)
        
        .openCustomSettings(function () {
          $scope.wizard = params.wizard;
          $scope.wizard.start($scope);
        })
    };


    return NVD3WidgetV2;
  }]);
});
