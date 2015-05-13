import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import 'widgets/data-util/dps';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.steps/select-dataset";
import "widgets/v2.steps/make-query";
import "widgets/v2.steps/post-process";


import "widgets/wizard/step"


const m = angular.module('app.widgets.r-bar', [
  'app.widgets.nvd3-widget',
  "app.widgets.data-util.dps",
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.select-dataset",
  "app.widgets.v2.steps.make-query",
  "app.widgets.v2.steps.post-process",
  
  
  "app.widgets.wizard.step"
]);



m.controller('Nvd3BarChartCtrl', function ($scope, $http, APIProvider, NVD3Widget, 
                                           Requestor, 
                                           Wizard,
                                           EditWidgetID,
                                           SelectDataset,
                                           MakeQuery,
                                           PostProcess, 
                                           $modal,
                                           Step, $timeout) {
 
    
      $scope.APIProvider = new APIProvider($scope);

      $scope.APIProvider.config(function () {


        // var queryRequest = {
        //   "data_id": "",
        //   "params": {
        //        "select": [
        //         {
        //           "dimension":"year",
        //           "collection": [],
        //           "role": "Rows"
        //         },
                
        //         {
        //           "dimension":"country",
        //           "collection": ["UKR","RUS","USA"],
        //           "role": "Columns"
        //         },
        //         {
        //           "dimension":"indicator",
        //           "collection": [],
        //           "role": "Split Columns"
        //         }
        //       ],
        //       "r":Math.random()
        //     },
        //     "proc_name": "query",
        //     "response_type": "data_id"
        //   };

        //  var barSerieRequest = {
        //   "data_id": "",
        //   "proc_name": "barchartserie",
        //   "response_type": "data"
        //  };                 

        // var CorrMatrixRequest = {
        //   "data_id": "",
        //   "proc_name": "corr-table",
        //   "response_type": "data"
        //  }; 

        //  var NormRequest = {
        //   "data_id": "",
        //   "params": {
        //     "mode" : "Range to [0,1]",
        //     "direction" : "Columns"
        //   },
        //   "proc_name": "normalizer",
        //   "response_type": "data",
        // }    

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
      //   var corrDataId;

      // new Requestor()
      //   .push("getOptions",function(requestor,value){
      //     $http.get("./widgets/nvd3-bar/options.json")
      //     .success(function(data){
      //       $scope.options = data;
      //       $scope.options.chart.x = function (d) { return d.label };
      //       $scope.options.chart.y = function (d) { return d.value };
      //       requestor.resolve(value)
      //     })                
      //   })
      //   .push("executeQuery",function(requestor,data_id){
      //     queryRequest.data_id = data_id;
      //     $http.post("./api/data/process/",queryRequest)
      //     .success(function (data) {
      //         console.log("Query")
      //         corrDataId = data.data_id;
      //         requestor.resolve(data.data_id)          
      //     })
      //    })
      //   .push("generateSeries",function(requestor,data_id){
      //     console.log("Bar Serie")
      //     barSerieRequest.data_id = data_id;
      //     $http.post("./api/data/process/",barSerieRequest)
      //         .success(function (response) {
      //            $scope.data = response.data;
      //             requestor.resolve(response)          
      //     })
      //    })
      //   .execute("5549da85441fbbbc25a0632a",function(data){
      //     $scope.settings = {options: $scope.options, data: $scope.data };
          
      //     CorrMatrixRequest.data_id = corrDataId;
      //     $http.post("./api/data/process/",CorrMatrixRequest)
      //     .success(function (data) {
      //         console.log("Correlation",data)
      //     })

          
      //     $http.post("./api/data/process/",
      //         {
      //           "data_id": corrDataId,
      //           "params": {
      //             "mode" : "Range to [0,1]",
      //             "direction" : "Rows"
      //           },
      //           "proc_name": "normalizer",
      //           "response_type": "data",
      //           "r": Math.random()
      //         }    
      //       )
      //       .success(function (data) {
      //           console.log("Norm Rows [0,1]",data)
      //     })

          
      //     $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "Standartization",
      //               "direction" : "Rows"
      //             },
      //             "proc_name": "normalizer",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Norm Rows Standartization",data)
      //     })
          
          
          
      //      $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "Logistic",
      //               "direction" : "Rows"
      //             },
      //             "proc_name": "normalizer",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Norm Rows Logistic",data)
      //     })

      //     $http.post("./api/data/process/",
      //         {
      //           "data_id": corrDataId,
      //           "params": {
      //             "mode" : "Range to [0,1]",
      //             "direction" : "Columns"
      //           },
      //           "proc_name": "normalizer",
      //           "response_type": "data",
      //           "r": Math.random()
      //         }    
      //       )
      //       .success(function (data) {
      //           console.log("Norm Columns [0,1]",data)
      //     })

          
      //     $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "Standartization",
      //               "direction" : "Columns"
      //             },
      //             "proc_name": "normalizer",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Norm Columns Standartization",data)
      //     })
          
          
          
      //      $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "Logistic",
      //               "direction" : "Columns"
      //             },
      //             "proc_name": "normalizer",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Norm Columns Logistic",data)
      //     })


      //     $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "All Nulls",
      //               "direction" : "Rows"
      //             },
      //             "proc_name": "reduce-null",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Reduce Rows Has Null",data)
      //     })

      //      $http.post("./api/data/process/",
      //           {
      //             "data_id": corrDataId,
      //             "params": {
      //               "mode" : "Has Null",
      //               "direction" : "Columns"
      //             },
      //             "proc_name": "reduce-null",
      //             "response_type": "data",
      //             "r": Math.random()
      //           }    
      //         )
      //         .success(function (data) {
      //             console.log("Reduce Columns Has Null",data)
      //     })    

      //     $http.post("./api/data/process/",
      //           {
      //               "data_id":  corrDataId,
      //               "params": {
      //                 "axisX" : -1,
      //                 // "normalized": false,
      //                 // "mode" : "Range to [0,1]",
      //                 "pca" : true,
      //                 "includeLoadings": true,
      //                 "clustered" : true,
      //                 "clusters":2,
      //                 "includeCentroids":true,
      //                 "withRadius":true,
      //                 // ,
      //                 "precision":2     
      //               },
      //               "proc_name": "scatter-serie",
      //               "response_type": "data",
      //               "r": Math.random()
      //           }
      //         )
      //         .success(function (data) {
      //             console.log("Scatter",data)
      //     })    

      //     $http.post("./api/data/process/",
      //           {
      //               "data_id":  corrDataId,
      //               "params": {
      //                 "normalized": false,
      //                 "mode" : "Range to [0,1]",
      //                 "direction":"Columns",
      //                 "cumulate":false,
      //                 "beans":3,
      //                 "precision":2     
      //               },
      //               "proc_name": "distribution",
      //               "response_type": "data",
      //               "r": Math.random()
      //           }
      //         )
      //         .success(function (data) {
      //             console.log("Distribution",data)
      //     })    





      //   })

      }, true)
      .openCustomSettings(function () {
        console.log($scope)
        console.log(EditWidgetID.html)
        $scope.wizard = new Wizard($modal)
          .setTitle("R-BAR Settings")
          .push(EditWidgetID)
          .push(SelectDataset)
          .push(MakeQuery)
          .push(PostProcess)

          .push(            
            Step
          )
          
          .push(
            {
              title:"Step 2",
              description: "Make Query...", 
              html:"./widgets/wizard/s2.html",
                enable:function(wizard){
                  console.log("Enable Step 2");
                },
                disable:function(wizard){
                  console.log("Disable Step 2");
                },
                activate : function(wizard){
                  // wizard.enable(2)
                  console.log("Activate Step 2");
                }
            }
          )
           .push(
            {
              title:"Step 3",
              description: "Set widget decoration...", 
              html:"./widgets/wizard/s3.html",
                enable:function(wizard){
                  console.log("Enable Step 3");
                },
                disable:function(wizard){
                  console.log("Disable Step 3");
                },
                activate : function(wizard){
                  console.log("Activate Step 3");
                }
            }
          )

          .onStart(function(wizard){
            wizard.conf = angular.copy(wizard.parentScope.widget);
            console.log("Start Wizard")
            console.log(wizard.conf);
          })
          .onCompleteStep( function(wizard,step){
            console.log("OnComplete", step )
            if(step.index == 1){
              wizard.disable(wizard.getAboveIndexes(step));
              wizard.dataset = step.selectedDataset;
              wizard.enable(step.index+1);
            }
            if(step.index == 2){
              wizard.disable(wizard.getAboveIndexes(step));
              wizard.query = step.query;
              wizard.enable(step.index+1);
            }
            if(step.index == 3){
              console.log("POSTPROCESS",step)
              $http
                .post("./api/data/process",{
                  "data_id":  step.postprocessDataId,
                  "params": {
                      "axisX" : -1,
                      "normalized": step.normalize,
                      "mode" : step.mode,
                      "direction": step.direction,
                      "precision":step.precision,
                      "useColumnMetadata" : step.useHeaderMetadata,
                      "useRowMetadata" : step.useRowMetadata     
                  },
                "proc_name": "scatter-serie",
                "response_type": "data",
                "r": Math.random()
                })
                .success(function (data) {
                  console.log("Distribution",data)
                })    
            }

          })
          .onProcessStep( function(wizard,step){
            if(step.index == 1 || step.index == 2){
              wizard.disable(wizard.getAboveIndexes(step));
              return;
            }

          })

          .onCancel(function(wizard){
            console.log("Cancel Widget")
          })

          .onFinish(function(wizard){
            var conf = wizard.parentScope.widget; 
            conf.instanceName  =  wizard.steps[0].instanceName;
            conf.datasetID  =  wizard.steps[1].datasetID;
           
            
            console.log("Finish Widget")
            console.log( wizard.parentScope.widget )
          });
          $scope.wizard.start($scope);
      })
    
});
