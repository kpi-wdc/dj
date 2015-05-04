import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import 'widgets/data-util/dps';


const m = angular.module('app.widgets.r-bar', [
  'app.widgets.nvd3-widget',
  "app.widgets.data-util.dps"
]);



m.controller('Nvd3BarChartCtrl', function ($scope, $http, APIProvider, NVD3Widget, Requestor) {
 
    
      $scope.APIProvider = new APIProvider($scope);

      $scope.APIProvider.config(function () {


        var queryRequest = {
          "data_id": "",
          "params": {
               "select": [
                {
                  "dimension":"year",
                  "collection": ["2010","2011"],
                  "role": "Split Columns"
                },
                
                {
                  "dimension":"country",
                  "collection": ["UKR","RUS","USA"],
                  "role": "Rows"
                },
                {
                  "dimension":"indicator",
                  "collection": [],
                  "role": "Columns"
                }
              ],
              "r":42
            },
            "proc_name": "query",
            "response_type": "data_id"
          };

         var barSerieRequest = {
          "data_id": "",
          "proc_name": "barchartserie",
          "response_type": "data"
         };                 


        // new Requestor(
        //   [
        //     {
        //       execute:function(requestor,value){
        //         $http.get("./widgets/nvd3-bar/options.json")
        //         .success(function(data){
        //           $scope.options = data;
        //           $scope.options.chart.x = function (d) { return d.label };
        //           $scope.options.chart.y = function (d) { return d.value };
        //           requestor.resolve(value)
        //         })                
        //       }              
        //     },
        //     {
        //       execute: function(requestor,data_id){
        //           queryRequest.data_id = data_id;
        //           $http.post("./api/data/process/",queryRequest)
        //           .success(function (data) {
        //               console.log("Query")
        //               requestor.resolve(data.data_id)          
        //           })
        //       }
        //     },
        //     {
        //       execute: function(requestor,data_id){
        //         console.log("Bar Serie")
        //         barSerieRequest.data_id = data_id;
        //         $http.post("./api/data/process/",barSerieRequest)
        //             .success(function (response) {
        //                $scope.data = response.data;
        //                 requestor.resolve(response)          
        //         })
        //       }
        //     }
        //   ]
        // )
        // .execute("554788170dbe3d1024317bd6",function(data){
        //   $scope.settings = {options: $scope.options, data: $scope.data };
        // })


      new Requestor()
        .push("getOptions",function(requestor,value){
          $http.get("./widgets/nvd3-bar/options.json")
          .success(function(data){
            $scope.options = data;
            $scope.options.chart.x = function (d) { return d.label };
            $scope.options.chart.y = function (d) { return d.value };
            requestor.resolve(value)
          })                
        })
        .push("executeQuery",function(requestor,data_id){
          queryRequest.data_id = data_id;
          $http.post("./api/data/process/",queryRequest)
          .success(function (data) {
              console.log("Query")
              requestor.resolve(data.data_id)          
          })
         })
        .push("generateSeries",function(requestor,data_id){
          console.log("Bar Serie")
          barSerieRequest.data_id = data_id;
          $http.post("./api/data/process/",barSerieRequest)
              .success(function (response) {
                 $scope.data = response.data;
                  requestor.resolve(response)          
          })
         })
        .execute("554788170dbe3d1024317bd6",function(data){
          $scope.settings = {options: $scope.options, data: $scope.data };
        })

      }, true)

    
});
