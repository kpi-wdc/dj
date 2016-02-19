import angular from 'angular';
import 'custom-react-directives';


var m = angular.module("app.widgets.v2.steps.post-process",['custom-react-directives']);

m.factory("PostProcess",["$http", "dialog", "alert", function($http, dialog, alert){
	return {
		id: "PostProcess",

		title : "Data Preparation",

		
		description : "Select input data and set preparation settings",
        
    html : "./widgets/v2.steps/post-process.html",

    defaultSettings : {
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
      },
      transpose:false,
      
      order:{
        enable    :false,
        direction :"Rows",
        asc       :"A-Z",
        index     : 0
      },

      cluster:{
        enable    :false,
        direction :"Rows",
        count     : 2
      },
      
      aggregation : {
        "enable" : false,
        "direction" : "Rows",
        "data" : []
      },

      rank : {
        "enable" : false,
        "direction" : "Rows",
        "asc":"A-Z",
        "indexes" : []
      },

      limit : {
        "enable" : false,
        "start" : 1,
        "length":10
      },

      histogram : {
        "enable" : false,
        "direction" : "Rows",
        "cumulate" : false,
        "beans" : 5
      },

      correlation : {
        "enable" : false,
        "direction" : "Rows"
      },

      pca : {
        "enable" : false,
        "direction" : "Rows",
        "result" : "Scores"
      }              

    },

    avaibleAggregations:[
      {v:"min",enable:false},
      {v:"max",enable:false},
      {v:"avg",enable:false},
      {v:"std",enable:false},
      {v:"sum",enable:false}
    ],

    selectAggregation: function(){
      this.conf.postprocessSettings.aggregation.data = this.avaibleAggregations
      .filter((item) => item.enable)
      .map((item) => item.v);
    },

    onStartWizard: function(wizard){
      this.wizard = wizard;
      this.queries = wizard.parentScope.getQueries();
      this.inputQuery = undefined;
      this.conf = {
        postprocessSettings: this.defaultSettings,
      }
    },

    selectInputData: function(){
      
      this.avaibleAggregations.forEach((item) =>{item.enable = false});

      let thos = this;
      let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
      
      this.conf.postprocessSettings =  angular.copy(this.defaultSettings);
      this.conf.query = iq.context; 
      $http
        .get("./api/data/process/"+iq.context.queryResultId)
        .success(function (resp) {
            thos.wizard.context.table = resp.value;
            thos.conf.inputQueryResultId = resp.id;
            thos.makeLabelList(thos.wizard.context.table);
            thos.selectRankDirection(thos.wizard.context.table);
            thos.apply();
        })
    },

    activate : function(wizard){
      this.queries = wizard.parentScope.getQueries();
    },

    getSelectedItemsCount:function(collection){
       return collection.filter(function (item){return item == true}).length;
    }, 

    addQuery: function(){
      let q = this.wizard.parentScope.getQuery(this.conf);
      if(!q){
        let thos = this;
        dialog({
            title:"Enter Data Preparation Title",
            fields:{
              title:{title:"Title",value:"",editable:true,required:true}
            } 
        })
        .then(function(form){
           thos.wizard.parentScope.addPreparation(thos.conf,form.fields.title.value);
        })
      }else{
        alert.message(["Doublicate of Preparation",("This preparation exists with title: "+q.$title)]);
      }
    },

    
    makeRowLabelList: function(table){
      let metas = table.header[0].metadata.map((m,index) => {
          return { "label" : m.dimensionLabel, "index": (-index-1)}
      })

      let rows = table.body.map((item,index) => {
        return { "label" : item.metadata.map((m) => m.label).join("."), "index" : index }
      })

      this.rowLabelList = metas.concat(rows)

    },

    makeColLabelList: function(table){
      
      let metas = table.body[0].metadata.map((m,index) => {
         return { "label" : m.dimensionLabel, "index": (-index-1)}
      })

      let cols = table.header.map((item,index) => {
        return { "label" : item.metadata.map((m) => m.label).join("."), "index" : index }
      })

      this.colLabelList = metas.concat(cols)

    },

    makeLabelList: function(table){
      this.makeRowLabelList(table);
      this.makeColLabelList(table);
      this.selectOrderDirection()
    },

    selectOrderDirection: function(){
      this.criteriaLabel = undefined;
      if(this.conf.postprocessSettings.order.direction == "Rows"){
        this.orderCriteriaList = this.colLabelList
      }else{
        this.orderCriteriaList = this.rowLabelList
      }
    },

    selectOrderCriteria: function(){
      let thos = this;
      this.conf.postprocessSettings.order.index = this.orderCriteriaList
        .filter((item) => thos.criteriaLabel == item.label)[0].index;
    },

    selectRankDirection: function(){
      let table = this.wizard.context.table;
      if(this.conf.postprocessSettings.rank.direction == "Rows"){
       
        this.rankAlt =  table.body.map((item,index) => {
          return { "label" : item.metadata.map((m) => m.label).join("."), "index" : index, enable:false }
        })
 
      }else{
        this.rankAlt = table.header.map((item,index) => {
          return { "label" : item.metadata.map((m) => m.label).join("."), "index" : index, enable:false}
        })        
      }

    },

    selectRankAlt: function(){
      this.conf.postprocessSettings.rank.indexes = this.rankAlt
        .filter((item) => item.enable == true)
        .map((item) => item.index);
    },


    apply : function (){
      var thos = this;
      thos.wizard.context.postprocessedTable = undefined;
      $http
          .post("./api/data/process/",
            {
              "cache": false,
              "data_id": this.conf.inputQueryResultId,
              "params": this.conf.postprocessSettings,
              "proc_name": "post-process",
              "response_type": "data"
            }    
          )
          .success(function (resp) {
              thos.conf.queryResultId = resp.data_id;
              thos.wizard.context.postprocessedTable = resp.data;
              
          })
    }
	}
}]);	