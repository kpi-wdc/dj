import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-bar-h/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.hbar-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.hbar-chart-adapter",  
    "wizard-directives"]);

m.factory("HBarChartDecoration",[
	"$http",
	"$q", 
	"parentHolder",
	"HBarChartAdapter", 
	"pageWidgets",
	
	function(
		$http, 
		$q, 
		parentHolder, 
		HBarChartAdapter,
		pageWidgets ){

		let chartAdapter = HBarChartAdapter;

		return {
			id: "BarChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.steps/hbar-chart-decoration.html",


	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-bar-h/options.json",
	    			dataUrl : "./api/data/process/"
	    		}	

	    		this.queries = [];

	    		pageWidgets()
	    			.filter((item) => item.type =="v2.query-manager")
	    			.map((item) => item.queries)
	    			.forEach((item) => {this.queries = this.queries.concat(item)})

	    		if(this.conf.queryID){
	    			let thos = this;
	    			this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
	    		}	
	    	},

	    	onFinishWizard:  function(wizard){
	    		this.conf.decoration.setColor = undefined;
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.serieDataId  = this.conf.serieDataId; 
	    		wizard.conf.queryID  = this.conf.queryID;
	    		wizard.conf.dataID  = this.conf.dataID;

	    		this.settings = {options:angular.copy(this.options), data:[]};
	    		this.conf = {};
	    	},

	    	onCancelWizard: function(wizard){
				this.settings = {options:angular.copy(this.options), data:[]};
				this.conf = {};
	    	},

	    	reversePalette: function(){
				if ( this.conf.decoration.color ){
					this.conf.decoration.color = this.conf.decoration.color.reverse(); 
				}	
			},

			selectInputData: function(){
				let thos = this;
				thos.wizard.context.postprocessedTable = undefined;
      			let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
				this.conf.dataID = iq.context.queryResultId;
				this.conf.queryID = iq.$id;
				this.loadData();
			},

			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){
				let r = $http.post(this.conf.dataUrl,
					{
						"cache": false,
		                "data_id": this.conf.dataID,
		                "params": {},
		                "proc_name": "barchartserie",
		                "response_type": "data"
		            }
				)
				return r
			}, 

			loadData: function(){
				let thos = this;

				if(!this.wizard.context.postprocessedTable){
					$http
			          .get("./api/data/process/"+this.conf.dataID)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			          })
				}

				
				this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
					this.loadOptions().then( (options) => {
						thos.options = options.data;
	                	if(!thos.conf.decoration){
			            	thos.conf.decoration = chartAdapter.getDecoration(thos.options);
			            }
		            
			            thos.conf.decoration.setColor = (palette) => { console.log(thos, palette); thos.conf.decoration.color = angular.copy(palette) }
			            thos.options.chart.x = function (d) { return d.label };
		                thos.options.chart.y = function (d) { return d.value };
		                
		                thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
		                

		    //             thos.conf.decoration.title = thos.dataset.dataset.label;
						// thos.conf.decoration.subtitle = thos.dataset.dataset.source;
						// thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
						// thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
						// thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
					});

				this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
				 	this.loadSeries().then( (resp) => {
				 		thos.data = resp.data.data;
		                thos.conf.serieDataId = resp.data.data_id;
		            });

				$q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
					thos.apply()
				});
			},

			activate : function(wizard){
				this.dataset = wizard.context.dataset;
				if (this.conf.dataID){
					this.loadData();
				}
			},

			apply: function(){
				this.conf.decoration.width = parentHolder(this.wizard.conf).width;
				chartAdapter.applyDecoration(this.options,this.conf.decoration);
				this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
			}	
	    }
}]);    	




// import angular from 'angular';
// import 'widgets/nvd3-widget/nvd3-widget';
// import "widgets/v2.nvd3-bar-h/adapter";
// import "wizard-directives";


// var m = angular.module("app.widgets.v2.steps.hbar-chart-decoration",[
// 	'app.widgets.nvd3-widget',
//     "app.widgets.v2.hbar-chart-adapter", 
//     "wizard-directives"]);

// m.factory("HBarChartDecoration",[
// 	"$http",
// 	"$q", 
// 	"parentHolder",
// 	"HBarChartAdapter", 
// 	function(
// 		$http, 
// 		$q, 
// 		parentHolder, 
// 		HBarChartAdapter ){
		
// 		let chartAdapter = HBarChartAdapter;

// 		return {
// 			id: "HBarChartDecoration",

// 			title : "Chart Decoration",
			
// 			description : "Setup chart decoration options",
	        
// 	    	html : "./widgets/v2.steps/hbar-chart-decoration.html",

// 	    	onStartWizard: function(wizard){
// 	    		this.wizard = wizard;
// 	    		this.conf = {
// 	    			decoration : wizard.conf.decoration,
// 	    			serieRequest : wizard.conf.serieRequest,
// 	    			queryResultId : wizard.conf.queryResultId,
// 	    			serieDataId : wizard.conf.serieDataId,
// 	    			optionsUrl : "./widgets/v2.nvd3-bar-h/options.json",
// 	    			dataUrl : "./api/data/process/"
// 	    		}	
// 	    	},

// 	    	onFinishWizard:  function(wizard){
// 	    		this.conf.decoration.setColor = undefined;
// 	    		wizard.conf.decoration = this.conf.decoration;
// 	    		wizard.conf.serieRequest = this.conf.serieRequest;
// 	    		wizard.conf.serieDataId  = this.conf.serieDataId; 
// 	    		this.settings = {options:angular.copy(this.options), data:[]};
// 	    		this.conf = {};
// 	    	},

// 	    	onCancelWizard: function(wizard){
// 				this.settings = {options:angular.copy(this.options), data:[]};
// 				this.conf = {};
// 	    	},

// 	    	reversePalette: function(){
// 				if ( this.conf.decoration.color ){
// 					this.conf.decoration.color = this.conf.decoration.color.reverse(); 
// 				}	
// 			},

// 			loadOptions : function(){
// 				return $http.get(this.conf.optionsUrl)
// 			},

// 			loadSeries : function(){
// 				let r = $http.post(this.conf.dataUrl,
// 					{
// 		                "data_id": this.conf.queryResultId,
// 		                "params": {},
// 		                "proc_name": "barchartserie",
// 		                "response_type": "data"
// 		            }
// 				)
// 				return r
// 			}, 



// 			activate : function(wizard){
				
// 				this.conf.queryResultId = wizard.context.queryResultId;
// 				this.dataset = wizard.context.dataset;
// 				let thos = this;

// 				if(!this.wizard.context.postprocessedTable){
// 					$http
// 			          .get("./api/data/process/"+this.conf.queryResultId)
// 			          .success(function (resp) {
// 			              thos.wizard.context.postprocessedTable = resp.value;
// 			          })
// 				}

				
// 				this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
// 					this.loadOptions().then( (options) => {
// 						thos.options = options.data;
// 	                	if(!thos.conf.decoration){
// 			            	thos.conf.decoration = chartAdapter.getDecoration(thos.options);
// 			            }
		            
// 			            thos.conf.decoration.setColor = (palette) => {thos.conf.decoration.color = angular.copy(palette) }
// 			            thos.options.chart.x = function (d) { return d.label };
// 		                thos.options.chart.y = function (d) { return d.value };
		                
// 		                thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
		                

// 		    //             thos.conf.decoration.title = thos.dataset.dataset.label;
// 						// thos.conf.decoration.subtitle = thos.dataset.dataset.source;
// 						// thos.conf.decoration.caption = 'Note:'+ thos.dataset.dataset.note;
// 						// thos.conf.decoration.xAxisName = thos.dataset.dataset.label;
// 						// thos.conf.decoration.yAxisName = thos.dataset.dataset.label;
// 					});

// 				this.dataLoaded = //(this.dataLoaded) ? this.dataLoaded :
// 				 	this.loadSeries().then( (resp) => {
// 				 		thos.data = resp.data.data;
// 		                thos.conf.serieDataId = resp.data.data_id;
// 		            });

// 				$q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
// 					thos.apply()
// 				});
				
// 			},

// 			apply: function(){
// 				this.conf.decoration.width = parentHolder(this.wizard.conf).width;
// 				chartAdapter.applyDecoration(this.options,this.conf.decoration);
// 				this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
// 			}	
// 	    }
// }]);    	
