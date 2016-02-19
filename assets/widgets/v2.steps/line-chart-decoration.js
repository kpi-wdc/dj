import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-line/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.line-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.line-chart-adapter", 
    "wizard-directives"]);

m.factory("LineChartDecoration",[
	"$http",
	"$q", 
	"parentHolder",
	"LineChartAdapter",
	"pageWidgets", 
	function(
		$http, 
		$q, 
		parentHolder, 
		LineChartAdapter,
		pageWidgets ){
		
		let chartAdapter = LineChartAdapter;

		return {
			id: "LineChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.steps/line-chart-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			axisX : (wizard.conf.axisX) ? wizard.conf.axisX : -1,
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-line/options.json",
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
	    		wizard.conf.axisX = this.conf.axisX; 

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
		                "params": {"axisX":this.conf.axisX},
		                "proc_name": "scatter-serie",
		                "response_type": "data"
		            }
				)
				return r
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
		      this.wizard.conf.axisX = this.conf.axisX;
		      // console.log(this.conf)

		    },


		    loadData: function(){
				let thos = this;

				if(!this.wizard.context.postprocessedTable){
					$http
			          .get("./api/data/process/"+this.conf.dataID)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			               thos.axisXList = thos.makeAxisXList(thos.wizard.context.postprocessedTable);
			          })
				}else{
					 this.axisXList = this.makeAxisXList(this.wizard.context.postprocessedTable);
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
				 		thos.data = resp.data.data;
		                thos.conf.serieDataId = resp.data.data_id;

		            });

				$q.all([this.optionsLoaded, this.dataLoaded]).then(() => {
					// thos.apply()
					thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
					chartAdapter.applyDecoration(thos.options,thos.conf.decoration);
					thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)};
				});
			},

			activate : function(wizard){
				if (this.conf.dataID){
					this.loadData();
				}
			},

			apply: function(){
				this.activate(this.wizard)
			}	
	    }
}]);    	


