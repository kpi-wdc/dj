import angular from 'angular';
import 'widgets/data-util/dps';


var m = angular.module("app.widgets.v2.steps.distribution-post-process",["app.widgets.data-util.dps"]);

m.factory("DistributionPostProcess",["$http","Requestor", function($http, Requestor){
	return {
		
		title : "Postprocessing",

		
		description : "View data and setup data postprocessing",
        
    html : "./widgets/v2.steps/distribution-post-process.html",

    onStartWizard: function(wizard){
      this.wizard = wizard;
      this.postprocessSettings = wizard.conf.postprocessSettings;
      if(angular.isUndefined(this.postprocessSettings)){
        this._initSettings();
        this.wizard.process(this);
        return;
      }
      this.wizard.complete(this);
    },

    onFinishWizard: function(wizard){
      wizard.conf.postprocessSettings = this.postprocessSettings;
      wizard.conf.postprocess =  {
                "data_id": this.queryResultId,
                "params": 
                {
                  "normalized" : this.postprocessSettings.normalize, 
                  "mode" : this.postprocessSettings.mode,
                  "direction" : this.postprocessSettings.direction,
                  "precision" : this.postprocessSettings.precision
                },
                "proc_name": "normalizer",
                "response_type": "data"
              };
    },

    range: function(min,max){
      var result = [];
      for(var i=min; i<=max; i++) result.push(i)
  
      return result;  
    },

    getValue: function(value){
      return (value == null) ? "-" : value;
    },

    enable: function(wizard){
      // console.log("Enable Postprocess")
    },

    disable: function(wizard){
      wizard.postprocessSettings = undefined;
    },

    _initSettings: function(){
      // console.log("BEFORE INIT", this.wizard.postprocessSettings)
      this.postprocessSettings = {};
      this.postprocessSettings.normalize = false;
      this.postprocessSettings.direction = "Rows";
      this.postprocessSettings.mode = "Range to [0,1]";
      this.postprocessSettings.precision = 2;
      this.postprocessSettings.useColumnMetadata = [];
      this.postprocessSettings.useRowMetadata = [];
      this.postprocessSettings.cumulate = false;
      this.postprocessSettings.beans = 5;
      
      
      // console.log("INIT", this.postprocessSettings)
     },

    activate : function(wizard){
      this.wizard.process(this)
      this.query = wizard.conf.query;
      this.postprocessSettings = wizard.conf.postprocessSettings;

      if(angular.isUndefined(this.postprocessSettings)){
        this._initSettings();
        this.wizard.process(this);
      }
      
      var thos = this;
      // console.log(this.query);
      this.response = undefined;

      new Requestor()
        .push("getQueryResult",function(requestor,value){
            $http
              .post("./api/data/process/",thos.query)
              .success(function (data) {
                  // thos.response = data;
                  thos.queryResultId = data.data_id;
                  // thos.postprocessSettings.useColumnMetadata = data.data.header[0].metadata.map(function(item){return true});
                  // thos.postprocessSettings.useRowMetadata = data.data.body[0].metadata.map(function(item){return true});
                  requestor.resolve(thos.queryResultId)
              })
        })
        .push("postProcess",function(requestor,data_id){
            $http
            .post("./api/data/process/",
              {
                "data_id": data_id,
                "params": 
                {
                  "normalized" : thos.postprocessSettings.normalize || false, 
                  "mode" : thos.postprocessSettings.mode,
                  "direction" : thos.postprocessSettings.direction,
                  "precision" : thos.postprocessSettings.precision
                },
                "proc_name": "post-process",
                "response_type": "data"
              }    
            )
            .success(function (data) {
                thos.response = data;
                thos.postprocessDataId = data.data_id;
                thos.postprocessSettings.useColumnMetadata = (thos.postprocessSettings.useColumnMetadata.length == 0)?
                  thos.response.data.header[0].metadata.map(function(item){return true}) : thos.postprocessSettings.useColumnMetadata;
                thos.postprocessSettings.useRowMetadata = (thos.postprocessSettings.useRowMetadata.length == 0)?
                  thos.response.data.body[0].metadata.map(function(item){return true}):thos.postprocessSettings.useRowMetadata;
                requestor.resolve()
          })
        })
        .execute(null,function(data){
          thos.wizard.complete(thos);
        })      
        
    },

    getSelectedItemsCount:function(collection){
       return collection.filter(function (item){return item == true}).length;
    }, 

    apply : function (){
      this.wizard.process(this)
      // console.log(this.postprocessSettings)

      if (this.postprocessSettings.normalize == true){
        this.response = undefined;
        var thos = this;
        $http
            .post("./api/data/process/",
              {
                "data_id": this.queryResultId,
                "params": 
                {
                  "normalized" : this.postprocessSettings.normalize || false, 
                  "mode" : this.postprocessSettings.mode,
                  "direction" : this.postprocessSettings.direction,
                  "precision" : this.postprocessSettings.precision
                },
                "proc_name": "post-process",
                "response_type": "data"
              }    
            )
            .success(function (data) {
                thos.response = data;
                thos.postprocessDataId = data.data_id;
                thos.wizard.complete(thos);
          })
      }else{
        this.activate(this.wizard);
      }      
    }

	}
}]);	