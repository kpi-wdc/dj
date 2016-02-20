import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-chord/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.chord-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.chord-chart-adapter",  
    "wizard-directives"]);

m.factory("ChordChartDecoration",[
	"$http",
	"$q", 
	"parentHolder",
	"NVD3ChordAdapter", 
	"pageWidgets",
	
	function(
		$http, 
		$q, 
		parentHolder, 
		NVD3ChordAdapter,
		pageWidgets ){

		let chartAdapter = NVD3ChordAdapter;

		return {
			id: "ChordChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.steps/chord-chart-decoration.html",


	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-chord/options.json",
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
		                "data_id": this.conf.dataID,
		                "params": {},
		                "proc_name": "corr-matrix",
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
		            
			            thos.conf.decoration.setColor = (palette) => { console.log(thos, palette); 
			            	thos.conf.decoration.color = angular.copy(palette) }
			            // thos.options.chart.x = function (d) { return d.label };
		             //    thos.options.chart.y = function (d) { return d.value };
		                thos.options.chart.tooltipContent = function (serie, x, y, s) {
				              return  "<center><b>" 
				                      + s.point.label 
				                      + "</b><br/>" 
				                      + s.series.key 
				                      + " : " 
				                      + s.point.value.toFixed(2) 
				                      + "</center>"
				              }
		                
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

