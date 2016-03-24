import angular from 'angular';
// import "ng-json-explorer";
import "widgets/wizard/wizard";
import "widgets/v2.steps/select-dataset";
import "widgets/v2.steps/make-query";
// import "widgets/v2.steps/post-process";
import "md5";
import "custom-react-directives";


let m = angular.module('app.widgets.v2.query-manager', [
  "custom-react-directives",
  // 'ngJsonExplorer',
  "app.widgets.wizard",
  "app.widgets.v2.steps.select-dataset",
  "app.widgets.v2.steps.make-query",
  // "app.widgets.v2.steps.post-process"
]);

m.service("md5", function(){return md5});

m.factory("Queries",function(){
  return {
    scope: undefined,
    
    init: (scope) => {
      this.scope = scope;
      scope.widget.queries = (scope.widget.queries) ? scope.widget.queries : [];
    },


    add: (query, type, title) => {
      let q = {
        $id: md5(angular.toJson(query)),
        $listeners: 0,
        $type: type,
        $title: title,
        context: query
      }
      let oq = this.scope.widget.queries.filter((item) => item.$id == q.$id)[0]
      if(oq) {
        return oq
      }else{
        this.scope.widget.queries.push(q);
        return q;
      }
    },

    remove: (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if(query){ // && (query.$listeners.length == 0)){
        this.scope.widget.queries = this.scope.widget.queries.filter((item) => item.$id != queryID)
      }
    },

    get : (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if( query ) query.$listeners++;
      return query;
    },

    release: (queryID) => {
      let query = this.scope.widget.queries.filter((item) => item.$id == queryID)[0];
      if( query ) query.$listeners--;
    },

    getQuery : (query) => {
      let id = md5(angular.toJson(query));
      return this.scope.widget.queries.filter((item) => item.$id == id)[0]
    }
  }
});


m._projectionWizard = undefined;

m.factory("ProjectionWizard",[
  "$http",
  "$modal", 
  "Wizard",
  "SelectDataset",
  "MakeQuery",
    function (  
          $http,
          $modal, 
          Wizard,
          SelectDataset,
          MakeQuery) {
      
      if (!m._projectionWizard){
        m._projectionWizard = 
         new Wizard($modal)
            .setTitle("Data Cube Projection Wizard")
            .setIcon("./widgets/v2.query-manager/projection.png")
            .push(SelectDataset)
            .push(MakeQuery)
            .onStart(function(wizard){
              wizard.context = {};
              // console.log("Start");
            })
            .onCompleteStep( function(wizard,step){
              // console.log("complete",step.title, wizard.context);
              if(step.title == "Dataset"){
                wizard.enable(step.index+1);
              }
            })
            .onProcessStep( function(wizard,step){
              // console.log("process",step.title, wizard.context);
              
              if(step.title == "Dataset"){
                wizard.disable(wizard.getAboveIndexes(step));
              }
            })
      }      

      return m._projectionWizard;  

}]);


// m._preparationWizard = undefined;

// m.factory("PreparationWizard",[
//   "$http",
//   "$modal", 
//   "Wizard",
//   "PostProcess",
//     function (  
//           $http,
//           $modal, 
//           Wizard,
//           PostProcess) {
      
//       if (!m._preparationWizard){
//         m._preparationWizard = 
//          new Wizard($modal)
//             .setTitle("Data Preparation Wizard")
//             .setIcon("./widgets/v2.query-manager/preparation.png")
//             .push(PostProcess)
//             .onStart(function(wizard){
//               wizard.context = {};
//               // console.log("Start");
//             })
//             .onCompleteStep( function(wizard,step){
//               // console.log("complete",step.title, wizard.context);
//             })
//             .onProcessStep( function(wizard,step){
//               // console.log("process",step.title, wizard.context);
//             })
//       }      

//       return m._preparationWizard;  

// }]);
// 
// 

m.controller("PreparationDialogController", function (
    $scope,
    $http,
    $modal,
    dialog,
    source,
    $modalInstance,
    Queries,
    pageWidgets,
    app
    ){

    $scope.source = source;
    $scope.script = [];
    $scope.operations = [];
    $scope.cursor = -1;

    $scope.pushOp = (o) => {
      if( $scope.cursor >= 0 && $scope.cursor < ($scope.script.length-1)){
        $scope.script.splice($scope.cursor+1,$scope.script.length - $scope.cursor-1)
      }
      $scope.script.push(o);
      $scope.cursor = $scope.script.length-1; 
      $scope.runScript(); 
    }

    $scope.moveCursor = (value) => {
      $scope.cursor = value;
      $scope.runScript();
    }

    $scope.addPreparation = () => {

      let queries = [];

          pageWidgets()
            .filter((item) => item.type =="v2.query-manager")
            .map((item) => item.queries)
            .forEach((item) => {queries = queries.concat(item)})

     
            
      dialog({
        title:"Enter Table Name",
        fields:{
          name:{
            title:"Table Name",
            type:"text",
            value:""
          }
        },
        validate: (form) => {
          let f1 = form.fields.name.value.length > 0;
          let f2 = queries.map((item) => item.$title).indexOf(form.fields.name.value) == -1;
          return (f1&&f2)
        }

      }).then((form) => {

        Queries.add(
          angular.copy({
            queryResultId: $scope.data_id, 
            postprocess:$scope.script
           }), "preparation", form.fields.name.value);
        app.markModified();
        $modalInstance.close();  
      })
      
    }

    $scope.close = () => {
       $modalInstance.close();  
    }


    $scope.avaibleAggregations = 
    [
        {title:"min",value:false},
        {title:"max",value:false},
        {title:"avg",value:false},
        {title:"std",value:false},
        {title:"sum",value:false}
    ];
    
    $scope.operations.push({
      title:"Reduce Nulls in Columns",
      action: () => {
        dialog({
          title: "Reduce Nulls in Columns",
          fields:{
            mode:{
              title:"Mode",
              type:"select",
              value:'',
              options:[
                {title:"Remove column then it contains one or more null values",value:"Has Null"},
                {title:"Remove column then it contains all null values",value:"All Nulls"}
              ]
            }
          }
        }).then((form) =>{
          $scope.pushOp({
            reduce : {
              "enable" : true,
              "mode" : form.fields.mode.value,
              "direction" : "Columns"
            }
          })
        })
      }  
    });

    $scope.operations.push({
      title:"Reduce Nulls in Rows",
      action: () => {
        dialog({
          title: "Reduce Nulls in Rows",
          fields:{
            mode:{
              title:"Mode",
              value:'',
              type:"select",
              options:[
                {title:"Remove row then it contains one or more null values",value:"Has Null"},
                {title:"Remove row then it contains all null values",value:"All Nulls"}
              ]
            }
          }
        }).then((form) =>{
          $scope.pushOp({
            reduce : {
              "enable" : true,
              "mode" : form.fields.mode.value,
              "direction" : "Rows"
            }
          })
        })
      }  
    });

    $scope.operations.push({
      title:"Principle Components from Rows",
      action: () => {
        dialog({
          title:"Principle Components from Rows",
          fields:{
            mode:{
              title:"Result type",
              type:"select",
              value:'',
              options:["Scores","Eigen Values"]
            }
          }
        }).then((form) => {
          $scope.pushOp({
            pca : {
              "enable" : true,
              "direction" : "Rows",
              "result" : form.fields.mode.value
            }  
          });  
        })
      }
    });

    $scope.operations.push({
      title:"Principle Components from Columns",
       action: () => {
          dialog({
            title:"Principle Components from Columns",
            fields:{
              mode:{
                title:"Result type",
                type:"select",
                value:'',
                options:["Scores","Eigen Values"]
              }
            }
          }).then((form) => {
            $scope.pushOp({
              pca : {
                "enable" : true,
                "direction" : "Columns",
                "result" : form.fields.mode.value
              }  
            });  
          })
        }
    });

    $scope.operations.push({
      title:"Clasterize Rows",
      action: () => {
        dialog({
          title:"Clasterize Rows",
          fields:{
            count:{
              title:"Count",
              type:"number",
              value:2,
              min:2,
              max:10
            }
          }

        }).then((form)=>{
          $scope.pushOp({
            cluster:{
              enable    :true,
              direction :"Rows",
              count     : form.fields.count.value
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Clasterize Columns",
      action: () => {
        dialog({
          title:"Clasterize Columns",
          fields:{
            count:{
              title:"Count",
              type:"number",
              value:2,
              min:2,
              max:10
            }
          }

        }).then((form)=>{
          $scope.pushOp({
            cluster:{
              enable    :true,
              direction :"Columns",
              count     : form.fields.count.value
            }
          })  
        })
      }
    });


    $scope.operations.push({
      title:"Histogram for Rows",
      action: () => {
        dialog({
          title:"Histogram for Rows",
          fields:{
            beans:{
              title:"Beans",
              type:"number",
              value:5,
              min:2,
              max:20
            },
            cumulate:{
              title: "Cumulate",
              type:"checkbox",
              value:false
            }
          }

        }).then((form) => {
           $scope.pushOp({
              histogram : {
                "enable" : true,
                "direction" : "Rows",
                "cumulate" : form.fields.cumulate.value,
                "beans" : form.fields.beans.value
              }
           }) 
        })
      }
    });

    $scope.operations.push({
      title:"Histogram for Columns",
      action: () => {
        dialog({
          title:"Histogram for Columns",
          fields:{
            beans:{
              title:"Beans",
              type:"number",
              value:5,
              min:2,
              max:20
            },
            cumulate:{
              title: "Cumulate",
              type:"checkbox",
              value:false
            }
          }

        }).then((form) => {
           $scope.pushOp({
              histogram : {
                "enable" : true,
                "direction" : "Columns",
                "cumulate" : form.fields.cumulate.value,
                "beans" : form.fields.beans.value
              }
           }) 
        })
      }
    });


    $scope.operations.push({
      title:"Correlations for Rows",
      action: () => {
        $scope.pushOp({
          correlation : {
            "enable" : true,
            "direction" : "Rows"
          }    
        })
      }
    });

    $scope.operations.push({
      title:"Correlations for Columns",
      action: () => {
        $scope.pushOp({
          correlation : {
            "enable" : true,
            "direction" : "Columns"
          }    
        })
      }
    }); 
    
    $scope.operations.push({
      title:"Normalize Rows",
      action: () => {
        
        dialog({
          title:"Normalize data for Each Row",
          fields:{
            mode:{
              title:"Normalization Mode",
              type:"select",
              value:"",
              options:["Range to [0,1]","Standartization","Logistic"]
            }
          }
        }).then((form) => {
          $scope.pushOp({
            normalization : {
              "enable" : true,
              "mode" : form.fields.mode.value,
              "direction" : "Rows"
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Normalize Columns",
     action: () => {
        
        dialog({
          title:"Normalize data for Each Column",
          fields:{
            mode:{
              title:"Normalization Mode",
              type:"select",
              value:"",
              options:["Range to [0,1]","Standartization","Logistic"]
            }
          }
        }).then((form) => {
          $scope.pushOp({
            normalization : {
              "enable" : true,
              "mode" : form.fields.mode.value,
              "direction" : "Columns"
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Aggregate Rows",
      action: () => {
        dialog({
          title: "Aggregate Rows",
          fields:{
            agg:{
              title: "For Each Row Add Aggregation",
              type: "checkgroup",
              value: $scope.avaibleAggregations
            }
          },    
          validate: (form) => {
              let oneOrMore = false;
              form.fields.agg.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }
        }).then((form)=>{
          let aggs = $scope.avaibleAggregations
            .filter( (item,index) => form.fields.agg.value[index].value)
            .map((item) => item.title)
          $scope.pushOp({
            aggregation : {
              "enable" : true,
              "direction" : "Rows",
              "data" : aggs
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Aggregate Columns",
      action: () => {
        dialog({
          title: "Aggregate Columns",
          fields:{
            agg:{
              title: "For Each Column Add Aggregation",
              type: "checkgroup",
              value: $scope.avaibleAggregations
            }
          },    
          validate: (form) => {
              let oneOrMore = false;
              form.fields.agg.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }
        }).then((form)=>{
          let aggs = $scope.avaibleAggregations
            .filter( (item,index) => form.fields.agg.value[index].value)
            .map((item) => item.title)
          $scope.pushOp({
            aggregation : {
              "enable" : true,
              "direction" : "Columns",
              "data" : aggs
            }
          })  
        })
      }
    }); 

    $scope.operations.push({
      title:"Rank for Rows",
      action: () => {

        let rows =  
          $scope.resultTable.header
            .map((item) => item.metadata.map((m) => m.label).join("."));
       
        dialog({
          title:"Rank for Rows",
          fields:{
            asc:{
              title:"Order",
              type:"select",
              value:"A-Z",
              options:["A-Z","Z-A"]
            },
            rows:{
              title:"Columns",
              type:"checkgroup",
              value:rows
            }
          },
          validate: (form) =>{
            let oneOrMore = false;
              form.fields.rows.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }

        }).then((form) => {
          let indexes; 
          $scope.pushOp({
            rank : {
              "enable" : true,
              "direction" : "Columns",
              "asc":form.fields.asc.value,
              "indexes" : form.fields.rows.value
                  .map((item,index) => (item.value) ? index : -1)
                  .filter((item) => item >= 0)
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Rank for Columns",
     action: () => {

        let rows =  
          $scope.resultTable.body
            .map((item) => item.metadata.map((m) => m.label).join("."));
       
        dialog({
          title:"Rank for Columns",
          fields:{
            asc:{
              title:"Order",
              type:"select",
              value:"A-Z",
              options:["A-Z","Z-A"]
            },
            rows:{
              title:"Rows",
              type:"checkgroup",
              value:rows
            }
          },
          validate: (form) =>{
            let oneOrMore = false;
              form.fields.rows.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }

        }).then((form) => {
          let indexes; 
          $scope.pushOp({
            rank : {
              "enable" : true,
              "direction" : "Rows",
              "asc":form.fields.asc.value,
              "indexes" : form.fields.rows.value
                  .map((item,index) => (item.value) ? index : -1)
                  .filter((item) => item >= 0)
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Format numbers",
      action: () => {
        dialog({
          title:"Format numbers",
          fields:{
            precision:{
              title:"Float Precision",
              type:"number",
              value:2,
              min:0,
              max:5
            }
          }
        }).then((form) => {
           $scope.pushOp({precision:form.fields.precision.value})
        })

      }
    });

    $scope.operations.push({
      title:"Transpose Table",
      action: () => {
        $scope.pushOp({transpose:true})
      }
    }); 

    $scope.operations.push({
      title:"Sort Rows",
      action: () => {
        
        let criterias = $scope.resultTable.body[0].metadata
          .map((m,index) => {
            return { "title" : m.dimensionLabel, "value": (-index-1)}
          }).concat(
            $scope.resultTable.header.map((item,index) => {
              return { "title" : item.metadata.map((m) => m.label).join("."), "value" : index }
            })
          );

        dialog({
          title:"Sort Rows",
          fields:{
            asc:{
              title:"Order",
              type:"select",
              value:"A-Z",
              options:["A-Z","Z-A"]
            },
            index:{
              title:"Criteria",
              type:"select",
              value:'',
              options: criterias
            }
          }
        }).then((form) =>{
          $scope.pushOp({
            order:{
              enable    :true,
              direction :"Rows",
              asc       :form.fields.asc.value,
              index     :form.fields.index.value
            }
          })  
        })

      }
    });

 $scope.operations.push({
      title:"Sort Columns",
      action: () => {
        
        let criterias = $scope.resultTable.header[0].metadata
          .map((m,index) => {
            return { "title" : m.dimensionLabel, "value": (-index-1)}
          }).concat(
            $scope.resultTable.body.map((item,index) => {
              return { "title" : item.metadata.map((m) => m.label).join("."), "value" : index }
            })
          );

        dialog({
          title:"Sort Columns",
          fields:{
            asc:{
              title:"Order",
              type:"select",
              value:"A-Z",
              options:["A-Z","Z-A"]
            },
            index:{
              title:"Criteria",
              type:"select",
              value:'',
              options: criterias
            }
          }
        }).then((form) =>{
          $scope.pushOp({
            order:{
              enable    :true,
              direction :"Columns",
              asc       :form.fields.asc.value,
              index     :form.fields.index.value
            }
          })  
        })

      }
    });

    $scope.operations.push({
      title:"Reduce Row Metadata",
     
      action: () => {

        // let rows = $scope.resultTable.body[0].metadata.map((item) => item.dimensionLabel);
        
        dialog({
          title:"Reduce Row Metadata",
          fields:{
            rows:{
              title:"Metadata Item",
              type:"checkgroup",
              value:$scope.resultTable.body[0].metadata.map((item) => item.dimensionLabel)
            }
          },
          validate: (form) =>{
            let oneOrMore = false;
              form.fields.rows.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }

        }).then((form) => {
           $scope.pushOp({
              useRowMetadata : form.fields.rows.value.map((item) => item.value)
           }) 
        })

      }
    });

    $scope.operations.push({
      title:"Reduce Column Metadata",
     
      action: () => {

        // let rows = $scope.resultTable.body[0].metadata.map((item) => item.dimensionLabel);
        
        dialog({
          title:"Reduce Column Metadata",
          fields:{
            rows:{
              title:"Metadata Item",
              type:"checkgroup",
              value:$scope.resultTable.header[0].metadata.map((item) => item.dimensionLabel)
            }
          },
          validate: (form) =>{
            let oneOrMore = false;
              form.fields.rows.value.forEach((item) => {
                oneOrMore |= item.value
              })
              return oneOrMore;
          }

        }).then((form) => {
           $scope.pushOp({
              useColumnMetadata : form.fields.rows.value.map((item) => item.value)
           }) 
        })

      }
    });

    $scope.operations.push({
      title:"Limit Rows",
      action: () => {
        dialog({
          title:"Limit Rows",
          fields:{
            start:{
              title:"Start Position",
              type:"number",
              value:1,
              min:1,
              max:$scope.resultTable.body.length
            },
            length:{
              title:"Row Count",
              type:"number",
              value:1,
              min:1
            }
          }

        }).then((form) => {
           $scope.pushOp({
              limit : {
                "enable" : true,
                "start" : form.fields.start.value,
                "length":form.fields.length.value,
              }
           }) 
        })

      }
    });

    $http
      .get("./api/data/process/"+source.context.queryResultId)
      .success(function (resp) {
          $scope.resultTable = resp.value;
          $scope.data_id = resp.data_id;
          // $scope.resultTable = angular.copy($scope.sourceTable)
          $scope.pushOp({select:{"source":source.$title}})
          
    });

    $scope.runScript = () =>{
      let script = $scope.script.filter((item,index) => index<=$scope.cursor)
       $scope.resultTable = undefined;
      $http
          .post("./api/data/process/",
            {
              "cache": false,
              "data_id": source.context.queryResultId,
              "params": {"script":script},
              "proc_name": "post-process",
              "response_type": "data"
            }    
          )
          .success(function (resp) {
              $scope.resultTable = resp.data;
              $scope.data_id = resp.data_id;

          })
    }   

    $scope.addOp = ()=>{
      dialog({
        title:"Add Operation",
        fields:{
          operation:{
            title:"Operation",
            type:"select",
            options:$scope.operations.map((item, index) => {return {title:item.title,value:index}}) 
          }
        }
      }).then((form) => {
        $scope.operations[form.fields.operation.value].action();
      })
    }  

})



m.controller('QueryManagerController', function (
    $scope,
    $http,
    $modal, 
    APIProvider,
    EventEmitter,
    pageSubscriptions,
    Queries,
    // PreparationCtrl,
    app,
    confirm,
    dialog,
    pageWidgets,
    ProjectionWizard
    ){

    $scope.addProjection = (context,title) => {
      Queries.add(angular.copy(context), "projection", title);
      app.markModified();
    }

    $scope.addPreparation = (context,title) => {
      Queries.add(angular.copy(context), "preparation", title);
      app.markModified();
    }

    $scope.getQuery = (context) => Queries.getQuery( context );

    $scope.invokeAddProjectionWizard = () => {
      $scope.wizard = ProjectionWizard;
      $scope.wizard.start($scope);
    }

    $scope.invokeAddPreparationWizard = () => {
      
      let queries = [];

          pageWidgets()
            .filter((item) => item.type =="v2.query-manager")
            .map((item) => item.queries)
            .forEach((item) => {queries = queries.concat(item)})

      dialog({
        title:"Select Preparation Source",
        note:"One from available sources shuld be selected", 
        fields:{
          source:{
            title:"Source",
            type:"select",
            options: queries.map((item,index) => {return {title:item.$title,value:index}})
          }
        }
      }).then((form) =>{
        // console.log("Select", form.fields.source.value)

        $modal.open({
            templateUrl: 'widgets/v2.query-manager/preparation-dialog.html',
            controller: 'PreparationDialogController',
            backdrop: 'static',
            resolve: {
              source: function () {
                    return queries[form.fields.source.value];
                }
              }
           })
          .result.then(function (newQuery) {

          });
      })



      // $scope.wizard = PreparationWizard;
      // $scope.wizard.start($scope);
    }

    $scope.select = (query) => {
        $scope.preview = undefined;
        $scope.selected = query;
       
       $http
        .get("./api/data/process/"+query.context.queryResultId)
        .success(function (resp) {
            $scope.preview = resp.value;

        })
    }

    $scope.del = (query) => {
      confirm("Delete query "+query.$title+" ?").then(() => {
        Queries.remove(query.$id);
        app.markModified();
      })
    }

    $scope.getQueries = () => $scope.widget.queries;
    
    this.getQueries = $scope.getQueries;

    new APIProvider($scope)
      .config(() => {
        // console.log("Configure Data Query Manager");
        Queries.init($scope)
      })
  });




  