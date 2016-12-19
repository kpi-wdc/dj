import angular from 'angular';
import 'dictionary';
import 'custom-react-directives';


var m = angular.module("app.widgets.v2.steps.make-query",['app','app.dictionary','custom-react-directives', 'app.dps']);

m.factory("MakeQuery",['$http', '$dps','$timeout', "$lookup", "$translate", '$q', "dialog", "alert",

  function( $http, $dps, $timeout, $lookup, $translate, $q, dialog, alert){

	return {

    id : "MakeQuery",
		
		title : "Query",

    description : "Make Query",
        
    html : "./widgets/v2.steps/make-query.html",

    onStartWizard: function(wizard){
      this.wizard = wizard;
      this.conf = {}
      // 
      // this.conf = {
      //   query : wizard.conf.query,
      //   dataset : wizard.conf.dataset
      // }

      // wizard.context.query = this.conf.query; 
      
      // if (angular.isUndefined(this.conf.query)){
      //     wizard.process(this);
      // }else{
      //     this.complete()
      // }  
    },

    onFinishWizard : function(wizard){
      // wizard.conf.query = this.conf.query;
      // wizard.conf.dataset = this.conf.dataset;
      // this.conf = {};
    },

    activate : function(wizard){
        // this.query = wizard.conf.query;
        this.conf.dataset = wizard.context.dataset;
        if(angular.isUndefined(this.conf.query)){
          wizard.process(this);
        }else{
          this.tryGetTable();
          // this.complete();
        }
    },

    complete : function(){
      
      this.wizard.context.dataset = this.conf.dataset;
      this.wizard.context.query = this.conf.query;
      if(!this.wizard.context.table && this.conf.query){
        let thos = this;
        $dps.post("/api/dataset/query",this.conf.query)
          .success( (resp) => {
            thos.wizard.context.table = resp;
            thos.wizard.complete(thos);            
          })
      }else{
        this.wizard.complete(this);
      }  
    },

    addQuery: function(){
      
      let defaultSettings = {
        useColumnMetadata : [],  
        useRowMetadata : [],
        normalization : {
          "enable" : false,
          "mode" : "Range to [0,1]",
          "direction" : "Columns"
        },
        reduce : {
          "enable" : false,
          "mode" : "Has Null",
          "direction" : "Columns"
        }
      };


      let q = this.wizard.parentScope.getQuery(this.conf.query);
      
      if(!q){
        let thos = this;
        dialog({
            title:"Enter Data Projection Title",
            fields:{
              title:{
                title:"Title",
                value:"",
                editable:true,
                required:true
              }
            } 
        })
        .then(function(form){
          

          $dps
              .post("/api/data/process/",
                {
                  "cache": false,
                  "data_query": thos.conf.query,
                  "params": defaultSettings,
                  "proc_name": "post-process",
                  "response_type": "data"
                }    
              )
              .success(function (resp) {
                  thos.conf.queryResultId = resp.data_id;
                  thos.wizard.context.postprocessedTable = resp.data;
                  thos.conf.dataset = undefined;
                  thos.wizard.parentScope.addProjection(thos.conf,form.fields.title.value);
                  // thos.wizard.context.queryResultId = resp.data_id;
                  // thos.conf.queryResultId = resp.data_id;
                  // thos.wizard.complete(thos);
            })  
           
        })
      }else{
        alert.message(["Doublicate of Projection",("This projection exists with title: "+q.$title)]);
      }
    },

    lookup: $lookup,

    setRole: function(dim, role){
      dim.role = role;
      this.wizard.process(this);
      this.tryGetTable();   
    },

    genSelectionString: function(dim){
      let buf = [];
      // let s = "";
      dim.selectionString = "";

      dim.values.forEach(function(item){
        if(item.selected){
          buf.push(item)
        }
      })
      if(buf.length === 0){
        dim.selectionString = "";
      }

      for(let i in buf){
        let k = ($lookup(buf[i].label).label)?$lookup(buf[i].label).label:buf[i].label;
        $translate(k).then(function(translation){
          dim.selectionString+=translation+", ";
          if(dim.selectionString.length >=45){
            dim.selectionString = dim.selectionString.substring(0,40)+"... ("+buf.length+" items) "
          }
        })
      }
    },

  select: function(dim,item){
    this.wizard.process(this);
    item.selected = item.selected || false;
    item.selected = !item.selected;
    this.genSelectionString(dim);
    this.tryGetTable();
  },

  selectAll: function(dim){
    this.wizard.process(this);
    dim.values.forEach(function(item){
      item.selected = true;
    })
    this.genSelectionString(dim);
    this.tryGetTable();
  },

  clear: function(dim){
    this.wizard.process(this);
    dim.values.forEach(function(item){
      item.selected = false;
    })
    this.genSelectionString(dim);
    this.tryGetTable();
  },
  
  reverse: function(dim){
    this.wizard.process(this);
    dim.values.forEach(function(item){
      item.selected = !item.selected;
    })
    this.genSelectionString(dim);
    this.tryGetTable();
  },

  getItemStyle: function(obj){
    if(obj.selected){
      return {
        "color":"#FFFFFF",
        "background-color":"#008CBA"
      }
    }  
    return {
        "color":"#008CBA",
        "background-color":"#FFFFFF"
      }
  },

  tryGetTable: function(){
    this.requestComplete = this.testQuery(this.conf.dataset); 
    if(this.requestComplete){
     this.request = this.makeRequest(this.conf.dataset);
     this.conf.query = this.request;
    if(this.canceler){
      this.canceler.resolve();
    }else{
      // this.wizard.process(this);
    }
                                                  
    this.canceler = $q.defer();
    let thos = this; 
     if(this.wizard.context.table){
        $dps.get("/api/table/delete/"+this.wizard.context.table.id)
          .success(function(){
            thos.wizard.context.table = undefined; 
            // item.tableID = undefined;
            
            $dps.post("/api/dataset/query",thos.request,{timeout:thos.canceler.promise})
              .success(function(resp){
              thos.wizard.context.table = resp;
              thos.complete();
              // item.tableID = resp.id;
              // $scope.canceler.resolve();
              // $scope.canceler = undefined;
            })
          }) 
     }else{
        this.wizard.context.table = undefined;
        // item.tableID = undefined;
        $dps.post("/api/dataset/query",this.request,{timeout:this.canceler.promise})
          .success(function(resp){
          thos.wizard.context.table = resp;
          thos.complete();
          // item.tableID = resp.id;
        })
     }
     
    }else{
      let thos = this;  
      if(this.wizard.context.table){
        $dps.get("/api/table/delete/"+this.wizard.context.table.id)
          .success(function(){
            thos.wizard.context.table = undefined;
            // item.tableID = undefined;
        });
      }      
    }
  },

  makeRequest: function(item){
    let req = {};
    req.commitID = item.dataset.commit.id;
    req.datasetID = item.dataset.id;
    
    req.query = [];
    req.locale = $translate.use();
    for(let i in item.dimension){
      let d = item.dimension[i];
      let collection = this.getSelectedItems(d);
      if (collection.length == d.values.length){
        collection = [];
      }else{
        collection = collection.map(function(item){
          return item.id;
        })
      }
      req.query.push(
          {
            "dimension" : i,
            "role" : d.role,
            "collection" : collection 
          }
      )
    }
    return req   
  },

  getSelectedItems: function(d){
        let buf = [];
        d.values.forEach(function(item){
          if(item.selected){
            buf.push(item)
          }
        })
        return buf;
  },

  testQuery: function(item){
      let columnsAvailable = false;
      let rowsAvailable = false;
      let splitColumnsAvailable = true;
      let splitRowsAvailable = true;
      for(let i in item.dimension){
        let d = item.dimension[i];
        if(d.role == "Columns" && this.getSelectedItems(d).length>0) columnsAvailable = true;
        if(d.role == "Rows" && this.getSelectedItems(d).length>0) rowsAvailable = true;
        if(d.role == "Split Columns"){
          if(this.getSelectedItems(d).length>0){
            splitColumnsAvailable &= true;
          }else{
            splitColumnsAvailable &= false;
          }
        }  
        if(d.role == "Split Rows"){
          if (this.getSelectedItems(d).length>0){ 
            splitRowsAvailable &= true;
          }else{
            splitRowsAvailable &= false;
          }
        }
      }
      return columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable;
    }
 


	
  }
}]);	