import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-stacked-area/adapter";
import "wizard-directives";
import 'ng-ace';

var m = angular.module("app.widgets.v2.steps.stacked-area-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.stacked-area-chart-adapter", 
    "wizard-directives",
    "app.dps", "ng.ace"]);

m.factory("StackedAreaChartDecoration",[
	"$http",
	"$dps",
	"$q", 
	"parentHolder",
	"StackedAreaAdapter",
	"pageWidgets", "i18n", "dialog", "$error", "dpsEditor",
	function(
		$http, 
		$dps,
		$q, 
		parentHolder, 
		StackedAreaAdapter,
		pageWidgets,i18n, dialog, $error, dpsEditor ){
		
		let chartAdapter = StackedAreaAdapter;

		return {
			id: "StackedAreaChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-stacked-area/stacked-area-chart-decoration.html",

	    	onStartWizard: function(wizard){
	    		// console.log("DECORATION START Wizard CONF", wizard.conf);
	    		// console.log("DECORATION START axisX", wizard.conf.axisX);
	    		this.inputQuery = undefined;
	    		
	    		this.wizard = wizard;
	    		this.conf = {
	    			axisX : (angular.isDefined(wizard.conf.axisX)) ? wizard.conf.axisX : -1,
	    			category : wizard.conf.category,
	    			index : (wizard.conf.index) ? wizard.conf.index : [],
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			script : wizard.conf.script,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-stacked-area/options.json",
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
	    		wizard.conf.axisX = this.conf.axisX;
	    		wizard.conf.category = this.conf.category;
	    		wizard.conf.index = this.conf.index;
	    		wizard.conf.emitters  = this.conf.emitters;  
	    		  
				
	    		this.settings = {options:angular.copy(this.options), data:[]};
	    		this.conf = {};
	    		this.inputQuery = undefined;

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
				this.conf.axisX = -1;
				this.conf.category = undefined;
				this.conf.index = [];
				this.loadData();
			},


			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){
				this.data = undefined; 
				if(this.conf.dataID)
					return $dps
					          .post("/api/data/script",{
					            "data"  : 	"source(table:'"+this.conf.dataID+"');"+
					            			"line(x:"+this.conf.axisX+","+
					            				"index:"+ JSON.stringify(this.conf.index)+","+
					            				"category:"+this.conf.category+
					            			");"+
					            			"save()",
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
					          
				return $http.get("./widgets/v2.nvd3-stacked-area/sample.json")          
			},

			makeAxisXList : function(table){
			    var result = [];
			    table.body[0].metadata.forEach(function(item,index){
			        result.push({
			        index : -index-1,
			        label : item.dimensionLabel 
			        })
			    });
			    if (table.header.length >1){
			      	table.header.forEach(function(column,index){
			        	var label = "";
			        	column.metadata.forEach(function(item){
			          	label = (label == "") ? item.label : label+", "+item.label;
			        	})
			        	result.push({
			          		index : index,
			          		label : label
			        	})
			      	});
		  		}
		      let thos = this;
		      this.axisXColumn = result.filter((item) => item.index == thos.conf.axisX)[0].label;
		      
		      return result;
		    },

		    selectAxisX : function(){
		      var thos = this;
		      this.conf.axisX = this.axisXList.filter((item) => item.label == thos.axisXColumn)[0].index;
		      
		      // console.log(this.conf)

		    },

		    makeCatList : function(table){
			    var result = [];
			    table.body[0].metadata.forEach(function(item,index){
			        result.push({
			        index : -index-1,
			        label : item.dimensionLabel 
			        })
			    });
			    if (table.header.length >1){
			      	table.header.forEach(function(column,index){
			        	var label = "";
			        	column.metadata.forEach(function(item){
			          	label = (label == "") ? item.label : label+", "+item.label;
			        	})
			        	result.push({
			          		index : index,
			          		label : label
			        	})
			      	});
		  		}
		  		// console.log("CatList",result)
		      let thos = this;
		      let c = result.filter((item) => item.index == thos.conf.category);
		      if( c.length>0){
		      	this.catColumn = c[0].label;
		      }else{
		      	this.catColumn = undefined
		      }
		      return result;
		    },

		    selectCat : function(){
		     if(this.catEnable && this.catColumn){	
		      var thos = this;
		      this.conf.category = this.catList.filter((item) => item.label == thos.catColumn)[0].index;
		     } else {
		     	this.conf.category = undefined;
		     } 
		    },


		    makeIndexList: function(table){
		        let thos = this;
		        return table.header.map((item,index) => {
		          return { 
		          	"label" : item.metadata.map((m) => m.label).join("."), 
		          	"index" : index, 
		          	"enable": (thos.conf.index.indexOf(index) >= 0)
		          }
		        })   
		    },

		    selectIndex: function(){
		      this.conf.index = this.indexList
		        .filter((item) => item.enable == true)
		        .map((item) => item.index);
		      if (this.conf.index.length == 0){
		      	this.indexList[0].enable=true;
		      	this.conf.index = [0];
		      }  
		    },



		    loadData: function(){
				let thos = this;

				if(!this.wizard.context.postprocessedTable){
					$dps
			          .get("/api/data/process/"+this.conf.dataID)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			              thos.axisXList = thos.makeAxisXList(thos.wizard.context.postprocessedTable);
			          	  thos.catList = thos.makeCatList(thos.wizard.context.postprocessedTable);
			          	  thos.indexList = thos.makeIndexList(thos.wizard.context.postprocessedTable);
			          	  

			          })
				}else{
					 this.axisXList = this.makeAxisXList(this.wizard.context.postprocessedTable);
					 this.catList = this.makeCatList(thos.wizard.context.postprocessedTable);
					 this.indexList = this.makeIndexList(thos.wizard.context.postprocessedTable);
			   }

				
				this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
					this.loadOptions().then( (options) => {
						thos.options = options.data;
	                	if(!thos.conf.decoration){
			            	thos.conf.decoration = chartAdapter.getDecoration(thos.options);
			            }
		            
			           thos.conf.decoration.setColor = (palette) => {thos.conf.decoration.color = angular.copy(palette) }
			           thos.options.chart.x = (d) => d.x;
		               thos.options.chart.y = (d) => d.y;
		                
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
				 		if (!thos.data.length){
				 			thos.data = [];
				 		}
		                thos.conf.serieDataId = resp.data.data.data_id;

		            });

				$q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
					// thos.apply()
					thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
					chartAdapter.applyDecoration(thos.options,thos.conf.decoration);
					thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)};
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
				this.activate(this.wizard)
			}	
	    }
}]);    	




// import angular from 'angular';
// import "widgets/v2.steps/palettes";
// import 'widgets/v2.nvd3-widget/nvd3-widget';
// import 'widgets/data-util/dps';
// import "widgets/v2.nvd3-stacked-area/adapter";

// var m = angular.module("app.widgets.v2.steps.stacked-area-chart-decoration",[
// 	"app.widgets.palettes",  
// 	'app.widgets.v2.nvd3-widget',
//     "app.widgets.data-util.dps",
//     "app.widgets.v2.stacked-area-chart-adapter"]);

// m.factory("StackedAreaChartDecoration",[
// 	"Palettes", "$http","parentHolder","Requestor", "StackedAreaAdapter", 
// 	function(Palettes,$http, parentHolder, Requestor, StackedAreaAdapter ){
// 	return {
		
// 		title : "Chart Decoration",
		
// 		description : "Setup chart decoration options",
        
//     	html : "./widgets/v2.steps/stacked-area-chart-decoration.html",

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
// 	                  "useRowMetadata": this.postprocessSettings.useRowMetadata,
// 	                  "axisX" : this.postprocessSettings.axisX
	                  
// 	                },
// 	                "proc_name": "scatter-serie",
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
// 	          $http.get("./widgets/nvd3-stacked-area/options.json")
// 	          .success(function(data){
// 	             thos.options = data;
                
// 	            if(thos.decoration){
// 	            	StackedAreaAdapter.applyDecoration(thos.options,thos.decoration)
// 	            }else{
// 	            	thos.decoration = StackedAreaAdapter.getDecoration(thos.options);
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
// 	            	thos.data = data.data;
// 	                thos.data_id = data.data_id;
// 	                console.log(thos.data)
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
// 			StackedAreaAdapter.applyDecoration(this.options,this.decoration);
// 			this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
// 			// this.makeRequest();
// 		}	
//     }
// }]);    	
