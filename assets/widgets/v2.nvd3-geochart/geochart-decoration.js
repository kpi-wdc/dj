import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-geochart/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.geochart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.geochart-adapter", 
    "wizard-directives",
    "app.dps"]);

m.factory("GeochartDecoration",[
	"$http",
	"$dps",
	"$q", 
	"parentHolder",
	"GeochartAdapter", 
	"pageWidgets",
	"i18n",
	
	function(
		$http, 
		$dps,
		$q, 
		parentHolder, 
		GeochartAdapter,
		pageWidgets,
		i18n ){

		return {
			id: "GeochartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-geochart/geochart-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {

	    			direction : (wizard.conf.direction) ? wizard.conf.direction : "Rows",
		            dataIndex : (wizard.conf.dataIndex) ? wizard.conf.dataIndex : [0],
	            	bins : (this.wizard.conf.bins) ? wizard.conf.bins : 2,
	            	scope : (this.wizard.conf.scope) ? wizard.conf.scope : "none",

	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-geochart/options.json",
	    			dataUrl : "/api/data/process/",
	    			emitters: wizard.conf.emitters
	    		}	

	    		this.queries = [];

	    		pageWidgets()
	    			.filter((item) => item.type =="v2.query-manager")
	    			.map((item) => item.queries)
	    			.forEach((item) => {this.queries = this.queries.concat(item)})

	    		if(this.conf.queryID){
	    			let thos = this;
	    			this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
	    		}else{
	    			this.inputQuery = undefined;
	    		}
	    		this.complete = false;	
	    	},

	    	onFinishWizard:  function(wizard){
	    		this.conf.decoration.setColor = undefined;
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.serieDataId  = this.conf.serieDataId; 
	    		wizard.conf.queryID  = this.conf.queryID;
	    		wizard.conf.dataID  = this.conf.dataID;
	    		wizard.conf.direction =  this.conf.direction;
            	wizard.conf.dataIndex =  this.conf.dataIndex;
    			wizard.conf.bins =  this.conf.bins;
    			wizard.conf.scope =  this.conf.scope;
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
				this.conf.dataID = iq.context.queryResultId;
				this.conf.queryID = iq.$id;
				this.loadData();
			},


			makeSerieList: function(table){
		        let thos = this;
		        let list = (this.conf.direction == "Rows")? table.header: table.body;
	        	return list.map((item,index) => {
			          return { 
			          	"label" : item.metadata.map((m) => m.label).join("."), 
			          	"index" : index, 
			          	"enable": (thos.conf.dataIndex.indexOf(index) >= 0)
			          }
	        	})  
		    },

		    selectSerie: function(){
		    	
		      this.conf.dataIndex = 
		      this.indexList
		        .filter((item) => item.enable == true)
		        .map((item) => item.index);
		      
		      if (this.conf.dataIndex.length == 0){
		      	this.indexList[0].enable=true;
		      	this.conf.dataIndex = [0];
		      }  
		    },

		    selectAllSeries: function(){
		    	this.indexList.forEach((item) => {
		    		item.enable = true;
		    	})
		    	this.selectSerie();
		    },

		    inverseSeriesSelection: function(){
		    	this.indexList.forEach((item) => {
		    		item.enable = !item.enable;
		    	})
		    	this.selectSerie();
		    },

		    clearSeriesSelection: function(){
				this.indexList.forEach((item) => {
		    		item.enable = false;
		    	})
		    	this.selectSerie();
		    },


		    fixBoundary: function(){
		    	if(this.conf.decoration.initialScope == true){
		    		this.conf.decoration.boundary = this.chartAPI.chart().boundary()
		    	}else{
		    		this.conf.decoration.boundary = {}
		    	}
		    },

		    setDirection: function(){
		    	 this.indexList = this.makeSerieList(this.wizard.context.postprocessedTable);
		    },


			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){

				return $dps
				          .post("/api/data/script",{
				            "data"  : 	"source(table:'"+this.conf.dataID+"');"+
				            			"geojson(dir:'"+this.conf.direction+"',"+
				            				"dataIndex:"+ JSON.stringify(this.conf.dataIndex)+","+
				            				"bins:"+this.conf.bins+","+
				            				"scope:'"+this.conf.scope+"'"+
				            			");"+
				            			"save()",
				            "locale": i18n.locale()
				          })


				// let r = $dps.post(this.conf.dataUrl,
				// 	{
				// 		"cache": false,
		  //               "data_id": this.conf.dataID,

		  //               "params": {
		  //               	"direction" : this.conf.direction,
		  //               	"dataIndex":this.conf.dataIndex,
	   //          			"bins":this.conf.bins,
	   //          			"scope" : this.conf.scope
				// 		},

		  //               "proc_name": "geochart-serie",
		  //               "response_type": "data"
		  //           }
				// )
				// return r
			}, 

			loadData: function(){
				let thos = this;
				this.complete = false;

				if(!this.wizard.context.postprocessedTable){
					$dps
			          .get("/api/data/process/"+this.conf.dataID)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			              thos.indexList = thos.makeSerieList(thos.wizard.context.postprocessedTable);
			          })
				}else{
					 this.indexList = this.makeSerieList(this.wizard.context.postprocessedTable);
				}

				
				this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
					this.loadOptions().then( (options) => {
						thos.options = options.data;
						thos.options.locale = i18n.locale();

	                	if(!thos.conf.decoration){
			            	thos.conf.decoration = GeochartAdapter.getDecoration(thos.options);
			            }
		            
			            thos.conf.decoration.setColor = (palette) => {
			            	thos.conf.decoration.color = angular.copy(palette);
			            	thos.conf.bins = thos.conf.decoration.color.length; 
			            }
			           
		                
		                thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;

		                thos.options.chart.tooltipContent = 
		                	function (serie, x, y, s) {
				              var locale = i18n.locale();
				              var name = (serie.properties.name[locale]) ? serie.properties.name[locale] : 
				                serie.properties.name.en 
				              var result = "<center><b>" + name + "</center></b>";
				              if (serie.properties.values && serie.properties.values[y.index()].c>=0) {
				                result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + 
				                         y.series[y.index()].key + 
				                          " : " + 
				                          serie.properties.values[y.index()].v + "</div>";
				              }
				              return result;
				            }
		                


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
					this.complete = true;
					thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
					thos.options.chart.width = thos.conf.decoration.width;
					GeochartAdapter.applyDecoration(thos.options,thos.conf.decoration);
					// console.log(thos.options,thos.conf.decoration)
					thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)};
					// thos.apply()
				});
			},

			activate : function(wizard){
				// this.dataset = wizard.context.dataset;
				if (this.conf.dataID){
					this.loadData();
				}
			},

			apply: function(){
				this.activate();
				// this.conf.decoration.width = parentHolder(this.wizard.conf).width;
				// geoChartAdapter.applyDecoration(this.options,this.conf.decoration);
				// this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
			}	
	    }
}]);    	
