import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-chord/adapter";
import "wizard-directives";
import 'ng-ace';

var m = angular.module("app.widgets.v2.steps.chord-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.chord-chart-adapter",  
    "wizard-directives",
    "app.dps","ng.ace"]);

m.factory("ChordChartDecoration",[
	"$http",
	'$dps',
	"$q", 
	"parentHolder",
	"NVD3ChordAdapter", 
	"pageWidgets","i18n", "dialog", "$error", "dpsEditor",
	
	function(
		$http, 
		$dps,
		$q, 
		parentHolder, 
		NVD3ChordAdapter,
		pageWidgets, i18n, dialog, $error, dpsEditor ){

		let chartAdapter = NVD3ChordAdapter;

		return {
			id: "ChordChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-chord/chord-chart-decoration.html",


	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			script : wizard.conf.script,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-chord/options.json",
	    			dataUrl : "/api/data/process/"
	    		}	

	    		this.queries = [{$id:'eventSource', $title:'setData(updateWithData) event'}];

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
	    		wizard.conf.script  = this.conf.script;
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
				this.conf.dataID = (iq.context) ? iq.context.queryResultId: undefined;
				this.conf.queryID = iq.$id;
				this.loadData();
			},

			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){
				if(this.conf.dataID)
					return $dps
					          .post("/api/data/script",{
					            "data"  : "source(table:'"+this.conf.dataID+"');deps();save()",
					            "locale": i18n.locale()
					          })


				if(this.conf.script)
                    return $dps.post("/api/script",{
                                "script": this.conf.script,
                                "locale": i18n.locale()
                            })
                            .then((resp) => {
                            	if (resp.data.type == "error") {
                                $error(resp.data.data)
                                return
                            };
                                return {data:resp}
                            })
                            	    	          
				return $http.get("./widgets/v2.nvd3-chord/sample.json")          

			}, 

			loadData: function(){
				let thos = this;

				if(!this.wizard.context.postprocessedTable){
					$dps
			          .get("/api/data/process/"+this.conf.dataID)
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
				 		thos.data = resp.data.data.data;
		                thos.conf.serieDataId = resp.data.data.data_id;
		            });

				$q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
					thos.apply()
				});
			},

			editScript: function() {
                var thos = this;
                dpsEditor(thos.conf.script)
                    .then((script) => {
                        thos.conf.script = script;
                        thos.loadData();
                    })
            },


			activate : function(wizard){
				this.dataset = wizard.context.dataset;
				// if (this.conf.dataID){
					this.loadData();
				// }
			},

			apply: function(){
				this.conf.decoration.width = parentHolder(this.wizard.conf).width;
				chartAdapter.applyDecoration(this.options,this.conf.decoration);
				this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
			}	
	    }
}]);    	

