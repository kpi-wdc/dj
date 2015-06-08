import angular from 'angular';
import "widgets/v2.steps/palettes";
import 'widgets/nvd3-widget/nvd3-widget';
import 'widgets/data-util/dps';
import "widgets/v2.nvd3-bar/adapter";

var m = angular.module("app.widgets.v2.steps.bar-chart-decoration",[
	"app.widgets.palettes",  
	'app.widgets.nvd3-widget',
    "app.widgets.data-util.dps",
    "app.widgets.v2.bar-chart-adapter"]);

m.factory("BarChartDecoration",[
	"Palettes", "$http","parentHolder","Requestor", "BarChartAdapter", 
	function(Palettes,$http, parentHolder, Requestor, BarChartAdapter ){
	return {
		
		title : "Chart Decoration",
		
		description : "Setup chart decoration options",
        
    	html : "./widgets/v2.steps/bar-chart-decoration.html",

    	palettes : Palettes,

    	onStartWizard: function(wizard){
    		this.wizard = wizard;
    		if(this.settings){
    			this.settings.options = undefined;
    			this.settings.data = undefined;
    		}
    	},

    	onFinishWizard:  function(wizard){
    		wizard.conf.decoration = this.decoration;
    	},

    	setColor : function(palette){
    		this.decoration.color = palette;
    		if(this.decoration.reversePalette == true) this.reversePalette();
    	},
		
		reversePalette: function(){
			if ( this.decoration.color ){
				var tmp = [];
				for(var i = this.decoration.color.length-1; i >= 0; i--){
					tmp.push(this.decoration.color[i]);
				}

				this.decoration.color=[];
				var thos = this;
				tmp.forEach(function(item){
					thos.decoration.color.push(item);
				})
			}	
		},

		makeRequest: function(){
			if(this.serieRequest){
				this.request = this.serieRequest;
				return;	
			}

			this.request = {
	                "data_id": this.queryResultId,
	                "params": 
	                {
	                  "mode" : this.postprocessSettings.mode,
	                  "direction" : this.postprocessSettings.direction,
	                  "precision" : this.postprocessSettings.precision,
	                  "normalized" : this.postprocessSettings.normalize,
	                  "useColumnMetadata": this.postprocessSettings.useColumnMetadata,
	                  "useRowMetadata": this.postprocessSettings.useRowMetadata
	                  
	                },
	                "proc_name": "barchartserie",
	                "response_type": "data"
	              };
	        this.serieRequest = this.request;      
	   },

		activate : function(wizard){
			
			this.postprocessSettings = wizard.conf.postprocessSettings;
			this.queryResultId = wizard.conf.queryResultId;
			this.serieRequest = wizard.conf.serieRequest;
			this.decoration = wizard.conf.decoration;

			this.makeRequest();
			var thos = this;

			new Requestor()
	        .push("getOptions",function(requestor){
	          $http.get("./widgets/nvd3-bar/options.json")
	          .success(function(data){
	             thos.options = data;
                
	            if(thos.decoration){
	            	BarChartAdapter.applyDecoration(thos.options,thos.decoration)
	            }else{
	            	thos.decoration = BarChartAdapter.getDecoration(thos.options);
	            }
	            thos.decoration.width = parentHolder(thos.wizard.conf).width;
	             thos.options.chart.x = function (d) { return d.label };
                 thos.options.chart.y = function (d) { return d.value };
	            requestor.resolve();
	          })                
	        })
	        .push("generateSeries",function(requestor){
	          	$http
	            .post("./api/data/process/",
	              thos.request    
	            )
	            .success(function (data) {
	                thos.data = data.data;
	                thos.data_id = data.data_id;
	                requestor.resolve(data.data_id)
	          	})
	         })
	        .execute(this.queryResultId,function(data){
	        	thos.serieDataId = data;
	        	thos.wizard.complete(thos);
	        	thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)}
	        	
	         });
          
		},

		apply: function(){

			this.decoration.width = parentHolder(this.wizard.conf).width;
			BarChartAdapter.applyDecoration(this.options,this.decoration);
			this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
			// this.makeRequest();
		}	
    }
}]);    	
