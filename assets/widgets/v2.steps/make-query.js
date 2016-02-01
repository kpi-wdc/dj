import angular from 'angular';
import 'dictionary';
import 'custom-react-directives';


var m = angular.module("app.widgets.v2.steps.make-query",['app','app.dictionary','custom-react-directives']);

m.factory("MakeQuery",['$http', '$timeout', "$lookup", "$translate", '$q',

  function( $http, $timeout, $lookup, $translate, $q){

	return {
		
		title : "Query",

    description : "Make Query",
        
    html : "./widgets/v2.steps/make-query.html",

    onStartWizard: function(wizard){
      this.wizard = wizard;
      this.query = wizard.conf.query;
      if (angular.isUndefined(this.query)){
        wizard.process(this);
      }else{
        this.wizard.complete(this)
      }  
    },

    onFinishWizard : function(wizard){
      wizard.conf.query = this.query;
    },

    activate : function(wizard){
        this.query = wizard.conf.query;
        this.dataset = wizard.conf.dataset;
        
        if(angular.isUndefined(this.query)){
          wizard.process(this);
        }else{
          this.tryGetTable();
          wizard.complete(this);
        }
    },

    lookup: $lookup,

    setRole: function(dim, role){
      dim.role = role;
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
    item.selected = item.selected || false;
    item.selected = !item.selected;
    this.genSelectionString(dim);
    this.tryGetTable();
  },

  selectAll: function(dim){
    dim.values.forEach(function(item){
      item.selected = true;
    })
    this.genSelectionString(dim);
    this.tryGetTable();
  },

  clear: function(dim){
    dim.values.forEach(function(item){
      item.selected = false;
    })
    this.genSelectionString(dim);
    this.tryGetTable();
  },
  
  reverse: function(dim){
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
    // console.log($scope.item);
    this.requestComplete = this.testQuery(this.dataset); 
    if(this.requestComplete){
     this.request = this.makeRequest(this.dataset);
     this.query = this.request;
    if(this.canceler){
      this.canceler.resolve();
    }else{
      this.wizard.process(this);
    }
                                                  
    this.canceler = $q.defer();
    let thos = this; 
     if(this.table){
        $http.get("./api/table/delete/"+this.table.id)
          .success(function(){
            thos.table = undefined; 
            // item.tableID = undefined;
            
            $http.post("./api/dataset/query",thos.request,{timeout:thos.canceler.promise})
              .success(function(resp){
              thos.table = resp;
              thos.wizard.complete(thos);
              // item.tableID = resp.id;
              // $scope.canceler.resolve();
              // $scope.canceler = undefined;
            })
          }) 
     }else{
        this.table = undefined;
        // item.tableID = undefined;
        $http.post("./api/dataset/query",this.request,{timeout:this.canceler.promise})
          .success(function(resp){
          thos.table = resp;
          thos.wizard.complete(thos);
          // item.tableID = resp.id;
        })
     }
     
    }else{
      let thos = this;  
      if(this.table){
        $http.get("./api/table/delete/"+this.table.id)
          .success(function(){
            thos.table = undefined;
            // item.tableID = undefined;
        });
      }      
    }
  },

  makeRequest: function(item){
    let req = {};
    req.commitID = item.dataset.commit.id;
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