import angular from 'angular';

var m = angular.module("app.widgets.v2.steps.make-query",[]);

m.factory("MakeQuery",function(){
	return {
		
		title : "Query",
		
		description : "Make Query",
        
    html : "./widgets/v2.steps/make-query.html",

    selectAll: function(section){
      section.items.forEach(function(item){
        item.selected = true;
      })
     if( this.testQuery()){
      this.wizard.complete(this)
     }else{
        this.query = undefined;
        this.wizard.process(this)
     }
    },

    clearSelection: function(section){
      section.items.forEach(function(item){
        item.selected = false;
      })
      if( this.testQuery()){
      this.wizard.complete(this)
      }else{
        this.query = undefined;
        this.wizard.process(this)
      }
    },

    inverseSelection: function(section){
        section.items.forEach(function(item){
        item.selected = !item.selected;
      })
     if( this.testQuery()){
      this.wizard.complete(this)
     }else{
        this.query = undefined;
        this.wizard.process(this)
     }
    },

    select: function(item){
      item.selected = !item.selected;
      if( this.testQuery()){
      this.wizard.complete(this)
     }else{
        this.query = undefined;
        this.wizard.process(this)
     }
    },

    setRole: function(section, role){
      
      if( role == "Columns" || role == "Rows"){
        var tmp = this.sections.filter(function(item){
          return item.dimension.role == role;
        })
        if(tmp.length>0){
          tmp[0].dimension.role = "Ignore";
        }
      }

      section.dimension.role = role;
      if( this.testQuery()){
        this.wizard.complete(this)
       }else{
          this.query = undefined;
          this.wizard.process(this)
       }
    },

    makeQuery: function(){
      var thos = this;
      this.query = {};
      this.query.data_id = this.wizard.dataset.id;
      this.query.proc_name = "query";
      this.query.response_type = "data";
      this.query.params={};
      this.query.params.select=[];
      this.sections.forEach(function(section){
        var collection = thos.getSelectedItems(section);
        if (collection.length == section.items.length){
          collection = [];
        }else{
          collection = collection.map(function(item){
            return item.id;
          })
        }
        thos.query.params.select.push(
            {
              dimension : section.dimension.id,
              role : section.dimension.role,
              collection : collection 
            }
          )
      })
    },

    testQuery : function(){
      var columnsAvailable = false;
      var rowsAvailable = false;
      var splitColumnsAvailable = true;
      var splitRowsAvailable = true;
      
      var thos = this;
      this.sections.forEach(function(section){
        if(section.dimension.role == "Columns" && thos.getSelectedItems(section).length>0) columnsAvailable = true;
        if(section.dimension.role == "Rows" && thos.getSelectedItems(section).length>0) rowsAvailable = true;
        if(section.dimension.role == "Split Columns"){
          if(thos.getSelectedItems(section).length>0){
            splitColumnsAvailable &= true;
          }else{
            splitColumnsAvailable &= false;
          }
        }  
        if(section.dimension.role == "Split Rows"){
          if (thos.getSelectedItems(section).length>0){ 
            splitRowsAvailable &= true;
          }else{
            splitRowsAvailable &= false;
          }
        }  
      })
     if (columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable) this.makeQuery();
     return columnsAvailable && rowsAvailable && splitColumnsAvailable && splitRowsAvailable;

    },

    getSelectedItems: function(section){
      var result = [];
        section.items.forEach(function(item){
          if(item.selected) result.push(item);
        });
      return result;
    },


    onStartWizard: function(wizard){
      this.wizard = wizard;
    },

    prepareSections: function(){
      this.sections = [];
      var thos = this;
      this.dataset.metadata.dimension.id.forEach(function (dim){
        var items = [];
        var labels = thos.dataset.metadata.dimension[dim].category.label;
        for(var i in labels){
          items.push({
              id:i,
              label:labels[i],
              selected:false
          })
        }
        thos.sections.push({
          dimension:{
            id:dim,
            label:thos.dataset.metadata.dimension[dim].label,
            role:"Ignore"
          },
          items:items
        })  
      });
    },
    
    activate : function(wizard){
        this.query = wizard.conf.query;
        this.dataset = wizard.dataset;
        this.prepareSections();
        if(angular.isUndefined(this.query)){
          this.query = [];
          var thos = this;
          this.dataset.metadata.dimension.id.forEach(function (dim){
            thos.query.push({
              dimension:dim,
              collection:null,
              role:"Ignore"
            });
          });
          wizard.process(this);
        }
    }	
	}
});	