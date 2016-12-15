import angular from 'angular';
import "widgets/wizard/wizard";
import "widgets/v2.steps/select-dataset";
import "widgets/v2.steps/make-query";
import "md5";
import "custom-react-directives";


let m = angular.module('app.widgets.v2.query-manager', [
  "custom-react-directives",
  "app.widgets.wizard",
  "app.widgets.v2.steps.select-dataset",
  "app.widgets.v2.steps.make-query",
  "app.dps"
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
  "$dps",
  "$modal", 
  "Wizard",
  "SelectDataset",
  "MakeQuery",
  "i18n",
    function (  
          $http,
          $dps,
          $modal, 
          Wizard,
          SelectDataset,
          MakeQuery,
          i18n) {
      
      if (!m._projectionWizard){
        m._projectionWizard = 
         new Wizard($modal)
            .setTitle("Data Cube Projection Wizard")
            .setIcon("./widgets/v2.query-manager/projection.png")
            .push(SelectDataset)
            .push(MakeQuery)
            .onStart(function(wizard){
              wizard.context = {};
            })
            .onCompleteStep( function(wizard,step){
              if(step.title == "Dataset"){
                wizard.enable(step.index+1);
              }
            })
            .onProcessStep( function(wizard,step){
              if(step.title == "Dataset"){
                wizard.disable(wizard.getAboveIndexes(step));
              }
            })
      }      

      return m._projectionWizard;  

}]);




m.controller("PreparationDialogController", function (
    $scope,
    $http,
    $dps,
    $modal,
    dialog,
    source,
    $modalInstance,
    Queries,
    pageWidgets,
    app,
    i18n
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
      if(!o.send) $scope.runScript(); 
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
        $dps
          .post("/api/data/script",{
            "data"  : $scope.script.map(item => item.shortName).join(";")+";save()",
            "locale": i18n.locale()
          })
          .success(function (resp) {
              console.log(resp)
              Queries.add(
                angular.copy({
                  queryResultId: resp.data.data_id, 
                  script:$scope.script
                 }), "preparation", form.fields.name.value);
              app.markModified();
              $modalInstance.close();
          })
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
      title:"Query data",
      action: () => {
      }
    });

   

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
            shortName: "reduce(mode:'"+form.fields.mode.value+"',direction : 'Columns')",//"Reduce Columns ("+form.fields.mode.value+")",
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
            shortName: "reduce(mode:'"+form.fields.mode.value+"',direction : 'Rows')",//"Reduce Rows ("+form.fields.mode.value+")",
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
            shortName: "pca(result:'"+form.fields.mode.value+"',direction : 'Rows')",//"PCA ("+form.fields.mode.value+") from Rows",
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
              shortName: "pca(result:'"+form.fields.mode.value+"',direction : 'Columns')",//"PCA ("+form.fields.mode.value+") from Columns",
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
            shortName: "cluster(count:'"+form.fields.count.value+"',direction : 'Rows')",//"Clusters ("+form.fields.count.value+") for Rows",
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
            shortName: "cluster(count:'"+form.fields.count.value+"',direction : 'Columns')",//"Clusters ("+form.fields.count.value+") for Columns",
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
              shortName: "cls(beans:"+form.fields.beans.value+",cumulate:"+form.fields.cumulate.value+",direction : 'Rows')",//,((form.fields.cumulate.value)? "Cumulate ": "")+"Histogram for Rows ("+form.fields.beans.value+" beans)",
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
              shortName: "cls(beans:"+form.fields.beans.value+",cumulate:"+form.fields.cumulate.value+",direction : 'Columns')",//((form.fields.cumulate.value)? "Cumulate ": "")+"Histogram for Columns ("+form.fields.beans.value+" beans)",
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
          shortName: "corr(direction:'Rows')",//"Correlations for Rows",
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
          shortName: "corr(direction:'Columns')",//"Correlations for Columns",
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
            shortName: "norm(direction:'Rows', mode:'"+form.fields.mode.value+"')",//"Normalize Rows("+form.fields.mode.value+")",
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
            shortName: "norm(direction:'Columns', mode:'"+form.fields.mode.value+"')",//"Normalize Columns("+form.fields.mode.value+")",
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
            shortName: "aggregate(direction:'Rows', data:"+JSON.stringify(aggs)+")",//"Aggregate Rows("+aggs.join(",")+")",
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
            shortName: "aggregate(direction:'Columns', data:"+JSON.stringify(aggs)+")",//"Aggregate Columns("+aggs.join(",")+")",
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
            shortName: "rank(direction:'Columns',asc:'"+form.fields.asc.value+"',indexes:"+
              JSON.stringify(
                form.fields.rows.value
                  .map((item,index) => (item.value) ? index : -1)
                  .filter((item) => item >= 0)
              )+")",
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
            shortName: "rank(direction:'Columns',asc:'"+form.fields.asc.value+"',indexes:"+
              JSON.stringify(
                form.fields.rows.value
                  .map((item,index) => (item.value) ? index : -1)
                  .filter((item) => item >= 0)
              )+")",
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
      title:"Merge Rows",
      action: () => {

        let rows =  
          $scope.resultTable.body
            .map((item,index) => {
              return {
                title:item.metadata.map((m) => m.label).join("."),
                value:index
              }  
            });
        
        dialog({
          
          title:"Merge Rows",
          fields:{
            master:{
              title:"Master row",
              type:"select",
              options:rows
            },
            slave:{
              title:"Slave row",
              type:"select",
              options:rows
            }
          }

        }).then((form) => {
          let indexes; 
          $scope.pushOp({
            shortName: "merge(direction:'Rows',master:"+form.fields.master.value+",slave:"+form.fields.slave.value+")",//"Merge Rows("+form.fields.master.value+","+form.fields.slave.value+")",
            merge : {
              "enable" : true,
              "direction" : "Rows",
              "master" : form.fields.master.value,
              "slave" : form.fields.slave.value
            }
          })  
        })
      }
    });

    $scope.operations.push({
      title:"Merge Columns",
      action: () => {

        let rows =  
          $scope.resultTable.header
            .map((item,index) => {
              return {
                title:item.metadata.map((m) => m.label).join("."),
                value:index
              }  
          });
        
        dialog({
          
          title:"Merge Columns",
          fields:{
            master:{
              title:"Master column",
              type:"select",
              options:rows
            },
            slave:{
              title:"Slave column",
              type:"select",
              options:rows
            }
          }

        }).then((form) => {
          let indexes; 
          $scope.pushOp({
            shortName:  "merge(direction:'Columns',master:"+form.fields.master.value+",slave:"+form.fields.slave.value+")",//"Merge Columns("+form.fields.master.value+","+form.fields.slave.value+")",
            merge : {
              "enable" : true,
              "direction" : "Columns",
              "master" : form.fields.master.value,
              "slave" : form.fields.slave.value
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
          $scope.pushOp({
            shortName: "format(precision:"+form.fields.precision.value+")",//"Number precision: "+form.fields.precision.value,
            precision:form.fields.precision.value
          })
        })

      }
    });

    $scope.operations.push({
      title:"Transpose Table",
      action: () => {
        $scope.pushOp({
          shortName:"transpose()",
          transpose:true
        })
      }
    }); 

     $scope.operations.push({
      title:"Inputation",
      action: () => {
        $scope.pushOp({
          shortName: "imput(direction:'Row', mode:'fill', from:'left'",//"Inputation",
          inputation : {
              "enable" : true,
              "direction": "Row",
              "mode": "fill",
              "from":"left"
          }    
        })
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
            shortName:"order(direction:'Row', asc:'"+form.fields.asc.value+"', index:"+form.fields.index.value+")",
            // "Sort Rows "+form.fields.asc.value+" order by "
            //   +criterias.filter((item) => { return (item.value - form.fields.index.value) == 0 })[0].title,
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
            shortName: "order(direction:'Columns', asc:'"+form.fields.asc.value+"', index:"+form.fields.index.value+")",
            // "Sort Columns "+form.fields.asc.value+" order by "
            //   +criterias.filter((item) => item.value == form.fields.index.value)[0].title,
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
              shortName: "reduceMeta(useRowMetadata:"+JSON.stringify(form.fields.rows.value.map((item) => item.value))+")",
              // "Use Row Metadata("+
              //   form.fields.rows.value
              //   .filter((item) => item.value)
              //   .map((item) => item.title)
              //   .join(",")
              //   +")",
              useRowMetadata : form.fields.rows.value.map((item) => item.value)
           }) 
        })

      }
    });

    $scope.operations.push({
      title:"Reduce Column Metadata",
     
      action: () => {

        
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
              shortName: "reduceMeta(useColumnMetadata:"+JSON.stringify(form.fields.rows.value.map((item) => item.value))+")",
              // "Use Column Metadata("+
              //   form.fields.rows.value
              //   .filter((item) => item.value)
              //   .map((item) => item.title)
              //   .join(",")
              //   +")",
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
              shortName:"limit(start:"+form.fields.start.value+", length:"+ form.fields.length.value+")",
              limit : {
                "enable" : true,
                "start" : form.fields.start.value,
                "length":form.fields.length.value,
              }
           }) 
        })

      }
    });

    // $dps
    //   .get("/api/data/process/"+source.context.queryResultId)
    //   .success(function (resp) {
    //       $scope.resultTable = resp.value;
    //       $scope.data_id = resp.data_id;
    //       $scope.pushOp({
    //         shortName: "source(table:'"+source.context.queryResultId+"')",//"Select "+source.$title+"("+ source.context.queryResultId +")",
    //         select:{
    //           "source":source.$title
    //         }
    //       })
          
    // });

    
    $scope.runScript = () =>{
      let script = $scope.script.filter((item,index) => index<=$scope.cursor)
      $scope.resultTable = undefined;

      console.log("RUN SCRIPT", script.map(item => item.shortName).join(";"))//+";save()")
      

      $dps
          .post("/api/data/script",{
            "data"  : script.map(item => item.shortName).join(";"),//+";save()",
            "locale": i18n.locale()
          })
          .success(function (resp) {
            console.log(resp)
              $scope.resultTable = resp.data;
              // $scope.data_id = resp.data.data_id;

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

    setTimeout(function(){
      $scope.pushOp({
            shortName: "source(table:'"+source.context.queryResultId+"')"
          })  
    },0)
    

})


m.controller("JoinDialogController", function(
  $scope, 
  $modalInstance,
  $http,
  $dps,
  pageWidgets,
  source,
  dialog,
  Queries,
  app,
  i18n){

    $scope.queries = [];

    pageWidgets()
      .filter((item) => item.type =="v2.query-manager")
      .map((item) => item.queries)
      .forEach((item) => {$scope.queries = $scope.queries.concat(item)})

    $scope.t1_data_id = source.context.queryResultId;
    $scope.t1_title = source.$title;

    $dps
        .get("/api/data/process/"+$scope.t1_data_id)
        .success(function (resp) {
            $scope.t1 = resp.value;
            $scope.t1_data_id = resp.id;
            $scope.t1_meta = ($scope.t1.body.length>0) 
              ? $scope.t1.body[0].metadata.map((item,index)=>{return {
                title:item.dimensionLabel,
                value:index
              }})
              : [];
        })    

    
    function _init(){
      $scope.test = [];
      $scope.t2_title = undefined;
      $scope.t2 = undefined;
      $scope.t2_data_id = undefined;
    }  

    _init();


    var queryTest = () => {
      
      if(!$scope.t2_title) {
        $scope.complete = false;
        return
      }  
      if(!$scope.mode){
        $scope.complete = false;
        return
      }
      if(!$scope.t1_data_id){
        $scope.complete = false;
        return
      }
      if(!$scope.t2_data_id){
        $scope.complete = false;
        return
      }
      $scope.complete = true;
      $scope.getJoin();
    }


      
    $scope.selectQuery = (q) => {
      _init();

      $scope.t2_title = q.$title;

      $dps
        .get("/api/data/process/"+q.context.queryResultId)
        .success(function (resp) {
            $scope.t2 = resp.value;
            $scope.t2_data_id = resp.id;
            $scope.t2_meta = ($scope.t2.body.length>0) 
              ? $scope.t2.body[0].metadata.map((item,index)=>{return {
                title:item.dimensionLabel,
                value:index
              }})
              : [];
             queryTest()    
        })
         
    } 

    $scope.addRowTest = () => {
      dialog({
        title:"Add Row Test",
        fields:{
          t1:{
            title:"Table 1 Row Meta",
            type:"select",
            value:'',
            options:$scope.t1_meta
          },
          t2:{
            title:"Table 2 Row Meta",
            type:"select",
            value:'',
            options:$scope.t2_meta
          }
        }
      }).then((form) => {
        $scope.test.push([form.fields.t1.value, form.fields.t2.value])
        queryTest()
      })
    } 

    $scope.deleteRowTest = (index) => {
      $scope.test.splice(index,1)
      queryTest()
    }

    $scope.selectMode = (m) => {
      $scope.mode = m;
      queryTest();
    }

    $scope.condition = () => {
      return $scope.test.map((t) => {
        return  "( "
                +$scope.t1_title
                +"."
                +$scope.t1_meta[t[0]].title
                +" = "
                +$scope.t2_title
                +"."
                +$scope.t2_meta[t[1]].title
                +" )"
      }).join(" AND ");
    }


    $scope.getJoin = () => {

      $scope.resultTable = undefined;
      $scope.loaded = true;
      $dps
          .post("/api/data/script",{
            "data"  : 
               "source(table:'"+$scope.t2_data_id+"')"
              +"set('t1')"
              + "source(table:'"+$scope.t1_data_id+"')"
              +"join(with:'{{t1}}', mode:'"+$scope.mode+"', on:"+JSON.stringify($scope.test)+")"
              +"cache()",
            "locale": i18n.locale()
          })

      // $dps
      //     .post("/api/data/process/",
      //       {
      //         "cache": false,
      //         "data_id": [$scope.t1_data_id,$scope.t2_data_id],
      //         "params": {
      //           join:{
      //             enable : true,
      //             mode : $scope.mode,
      //             test:$scope.test
      //           }  
      //         },
      //         "proc_name": "post-process",
      //         "response_type": "data"
      //       }    
      //     )
          .success(function (resp) {
              $scope.resultTable = resp.data.data;
              $scope.loaded = false;
              $scope.data_id = resp.data.data_id;
          })

    }

    $scope.save = () => {

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
          let f2 = $scope.queries.map((item) => item.$title).indexOf(form.fields.name.value) == -1;
          return (f1&&f2)
        }

      }).then((form) => {

        Queries.add(
          angular.copy({
            queryResultId: $scope.data_id, 
            }), "preparation", form.fields.name.value);
        app.markModified();
        $modalInstance.close();  
      })
    }

    $scope.cancel = () => {$modalInstance.close()}
})




m.controller('QueryManagerController', function (
    $scope,
    $http,
    $dps,
    $modal, 
    APIProvider,
    EventEmitter,
    pageSubscriptions,
    Queries,
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


    
     $scope.invokeAddJoinWizard = () => {
      
      let queries = [];

          pageWidgets()
            .filter((item) => item.type =="v2.query-manager")
            .map((item) => item.queries)
            .forEach((item) => {queries = queries.concat(item)})

      dialog({
        title:"Select Join Source",
        note:"One from available sources shuld be selected", 
        fields:{
          source:{
            title:"Source",
            type:"select",
            options: queries.map((item,index) => {return {title:item.$title,value:index}})
          }
        }
      }).then((form) =>{
        $modal.open({
          templateUrl: '/widgets/v2.query-manager/join-dialog.html',
          // windowClass: 'dialog-modal',
          backdrop: 'static',
          controller: 'JoinDialogController',
          resolve: {
            source: () => queries[form.fields.source.value]
          }
        })
      })
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
    }

    $scope.select = (query) => {
        $scope.preview = undefined;
        $scope.selected = query;
        $scope.selectedScript = (query.context.script)
          ? "Script: "+ query.context.script
              .map((item) => item.shortName).join(". ")
              +". Data ID: "
              +query.context.queryResultId
          : "Data ID: "+query.context.queryResultId; 
       
       $dps
        .get("/api/data/process/"+query.context.queryResultId)
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
        Queries.init($scope)
      })
  });




  