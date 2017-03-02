import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-radar/adapter";
import "wizard-directives";
import 'ng-ace';

var m = angular.module("app.widgets.v2.steps.radar-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.radar-chart-adapter", 
    "wizard-directives",
    "app.dps","ng.ace"]);

m.factory("RadarChartDecoration",[
	"$http",
	"$dps",
	"$q", 
	"parentHolder",
	"RadarChartAdapter", 
	"pageWidgets", "i18n", "dialog", "$error", "dpsEditor",
	function(
		$http, 
		$dps,
		$q, 
		parentHolder, 
		RadarChartAdapter,
		pageWidgets, i18n, dialog, $error, dpsEditor ){
		
		let chartAdapter = RadarChartAdapter;

		return {
			id: "RadarChartChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-radar/radar-chart-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			script : wizard.conf.script,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-radar/options.json",
	    			dataUrl : "/api/data/process/",
	    			emitters: wizard.conf.emitters
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
	    		wizard.conf.dataID  = this.conf.dataID;
	    		wizard.conf.script  = this.conf.script;
	    		wizard.conf.emitters  = this.conf.emitters;  

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
					            "data"  : "source(table:'"+this.conf.dataID+"');bar();save()",
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
                            	          

				return $http.get("./widgets/v2.nvd3-radar/sample.json")          
			}, 

			setupOptions: function(){
				var serieAdapter = this.wizard.parentScope.serieAdapter;
		   		  for (var i in serieAdapter) {
	                      this.options.chart[i] = serieAdapter[i];
	                   }
	  
	                  
	                  if(angular.isDefined(serieAdapter)){
	                    if (serieAdapter.getX) {
	                      this.options.chart.x = serieAdapter.getX;
	                    }

	                    if (serieAdapter.getY) {
	                      this.options.chart.y = serieAdapter.getY;
	                    }

	                    this.options.chart.label = serieAdapter.getLabel;

	                    if (this.options.chart.scatter) {
	                      this.options.chart.scatter.label = serieAdapter.getLabel;
	                    }
	                    if (this.options.chart.lines) {
	                      this.options.chart.lines.label = serieAdapter.getLabel;
	                    }
	                    if (this.options.chart.stacked && angular.isObject(this.options.chart.stacked)) {

	                      this.options.chart.stacked.label = serieAdapter.getLabel;
	                    }
	                  }   
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
		            
			            thos.conf.decoration.setColor = (palette) => {thos.conf.decoration.color = angular.copy(palette) }
			            // thos.options.chart.x = function (d) { return d.label };
		             //    thos.options.chart.y = function (d) { return d.value };
		                
		                this.options.chart.tooltipContent =  (serie, x, y, s) => 
		                "<center><b>" + s.point.label + "</b><br/>" + 
		                s.series.key + " : " + s.point.value.toFixed(2) + "</center>"
            
		                thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
		                thos.setupOptions();
		                

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



//
//
//
//

// import angular from 'angular';
// import "widgets/v2.steps/palettes";
// import 'widgets/nvd3-widget/nvd3-widget';
// import 'widgets/data-util/dps';
// import "widgets/v2.nvd3-radar/adapter";

// var m = angular.module("app.widgets.v2.steps.radar-chart-decoration",[
// 	"app.widgets.palettes",  
// 	'app.widgets.nvd3-widget',
//     "app.widgets.data-util.dps",
//     "app.widgets.v2.radar-chart-adapter"]);

// m.factory("RadarChartDecoration",[
// 	"Palettes", "$http","parentHolder","Requestor", "RadarChartAdapter", 
// 	function(Palettes,$http, parentHolder, Requestor, RadarChartAdapter ){
// 	return {
		
// 		title : "Chart Decoration",
		
// 		description : "Setup chart decoration options",
        
//     	html : "./widgets/v2.steps/radar-chart-decoration.html",

//     	palettes : Palettes,

//     	onStartWizard: function(wizard){
//     		this.wizard = wizard;
//     		if(this.settings){
//     			this.settings.options = undefined;
//     			this.settings.data = undefined;
//     		}
//     	},

//     	onFinishWizard:  function(wizard){
//     		wizard.conf.decoration = this.decoration;
//     	},

//     	setColor : function(palette){
//     		this.decoration.color = palette;
//     		if(this.decoration.reversePalette == true) this.reversePalette();
//     	},
		
// 		reversePalette: function(){
// 			if ( this.decoration.color ){
// 				var tmp = [];
// 				for(var i = this.decoration.color.length-1; i >= 0; i--){
// 					tmp.push(this.decoration.color[i]);
// 				}

// 				this.decoration.color=[];
// 				var thos = this;
// 				tmp.forEach(function(item){
// 					thos.decoration.color.push(item);
// 				})
// 			}	
// 		},

// 		makeRequest: function(){
// 			if(this.serieRequest){
// 				this.request = this.serieRequest;
// 				return;	
// 			}

// 			this.request = {
// 	                "data_id": this.queryResultId,
// 	                "params": 
// 	                {
// 	                  "mode" : this.postprocessSettings.mode,
// 	                  "direction" : this.postprocessSettings.direction,
// 	                  "precision" : this.postprocessSettings.precision,
// 	                  "normalized" : this.postprocessSettings.normalize,
// 	                  "useColumnMetadata": this.postprocessSettings.useColumnMetadata,
// 	                  "useRowMetadata": this.postprocessSettings.useRowMetadata
	                  
// 	                },
// 	                "proc_name": "barchartserie",
// 	                "response_type": "data"
// 	              };
// 	        this.serieRequest = this.request;      
// 	   },

// 	   setupOptions: function(){
// 	   	var serieAdapter = this.wizard.parentScope.serieAdapter;
// 	   		  for (var i in serieAdapter) {
//                       this.options.chart[i] = serieAdapter[i];
//                    }
  
                  
//                   if(angular.isDefined(serieAdapter)){
//                     if (serieAdapter.getX) {
//                       this.options.chart.x = serieAdapter.getX;
//                     }

//                     if (serieAdapter.getY) {
//                       this.options.chart.y = serieAdapter.getY;
//                     }

//                     this.options.chart.label = serieAdapter.getLabel;

//                     if (this.options.chart.scatter) {
//                       this.options.chart.scatter.label = serieAdapter.getLabel;
//                     }
//                     if (this.options.chart.lines) {
//                       this.options.chart.lines.label = serieAdapter.getLabel;
//                     }
//                     if (this.options.chart.stacked && angular.isObject(this.options.chart.stacked)) {

//                       this.options.chart.stacked.label = serieAdapter.getLabel;
//                     }
//                   }   
// 	   },

// 		activate : function(wizard){
			
// 			this.postprocessSettings = wizard.conf.postprocessSettings;
// 			this.queryResultId = wizard.conf.queryResultId;
// 			this.serieRequest = wizard.conf.serieRequest;
// 			this.decoration = wizard.conf.decoration;

// 			this.makeRequest();
// 			var thos = this;

// 			new Requestor()
// 	        .push("getOptions",function(requestor){
// 	          $http.get("./widgets/nvd3-radar/options.json")
// 	          .success(function(data){
// 	             thos.options = data;
                
// 	            if(thos.decoration){
// 	            	RadarChartAdapter.applyDecoration(thos.options,thos.decoration)
// 	            }else{
// 	            	thos.decoration = RadarChartAdapter.getDecoration(thos.options);
// 	            }
// 	            thos.decoration.width = parentHolder(thos.wizard.conf).width;
// 	            thos.setupOptions();	
// 	          //    thos.options.chart.x = function (d) { return d.label };
//            //       thos.options.chart.y = function (d) { return d.value };
//            //       thos.options.chart.tooltipContent: function (serie, x, y, s) {
//            //    			return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>"
//            //  	};
// 	            requestor.resolve();
// 	          })                
// 	        })
// 	        .push("generateSeries",function(requestor){
// 	          	$http
// 	            .post("./api/data/process/",
// 	              thos.request    
// 	            )
// 	            .success(function (data) {
// 	                thos.data = data.data;
// 	                thos.data_id = data.data_id;
// 	                requestor.resolve(data.data_id)
// 	          	})
// 	         })
// 	        .execute(this.queryResultId,function(data){
// 	        	thos.serieDataId = data;
// 	        	thos.wizard.complete(thos);
// 	        	thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)}
	        	
// 	         });
          
// 		},

// 		apply: function(){

// 			this.decoration.width = parentHolder(this.wizard.conf).width;
// 			RadarChartAdapter.applyDecoration(this.options,this.decoration);
// 			this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
// 			// this.makeRequest();
// 		}	
//     }
// }]);    	
