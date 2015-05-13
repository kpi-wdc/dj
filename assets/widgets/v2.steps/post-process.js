import angular from 'angular';

var m = angular.module("app.widgets.v2.steps.post-process",[]);

m.factory("PostProcess",["$http", function($http){
	return {
		
		title : "Postprocessing ",
		
		description : "View data and setup data postprocessing",
        
    html : "./widgets/v2.steps/post-process.html",

    onStartWizard: function(wizard){
      this.wizard = wizard;
    },

    range: function(min,max){
      var result = [];
      for(var i=min; i<=max; i++) result.push(i)
  
      return result;  
    },

    getValue: function(value){
      return (value == null) ? "-" : value;
    },

    activate : function(wizard){
      this.query = wizard.query;

      var thos = this;
      $http
        .post("./api/data/process/",this.query)
        .success(function (data) {
          thos.response = data;
          thos.queryResultId = data.data_id;
          thos.useHeaderMetadata = thos.response.data.header[0].metadata.map(function(item){return true});
          thos.useRowMetadata = thos.response.data.body[0].metadata.map(function(item){return true});
        })
    },

    getSelectedItemsCount:function(collection){
      console.log("Check Selection",collection)
      console.log("Result",collection.filter(function (item){return item == true}))
      return collection.filter(function (item){return item == true}).length;

    }, 

    apply : function (){

      if (this.normalize == true){
         this.response = undefined;
        var thos = this;
        $http
            .post("./api/data/process/",
              {
                "data_id": this.queryResultId,
                "params": {
                  "mode" : this.mode,
                  "direction" : this.direction,
                  "precision" : this.precision
                },
                "proc_name": "normalizer",
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