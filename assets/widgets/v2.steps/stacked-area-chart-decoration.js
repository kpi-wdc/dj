import angular from 'angular';
import "widgets/v2.steps/palettes";
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/data-util/dps';
import "widgets/v2.nvd3-stacked-area/adapter";

var m = angular.module("app.widgets.v2.steps.stacked-area-chart-decoration",[
	"app.widgets.palettes",  
	'app.widgets.v2.nvd3-widget',
    "app.widgets.data-util.dps",
    "app.widgets.v2.stacked-area-chart-adapter"]);

m.factory("StackedAreaChartDecoration",[
	"Palettes", "$http","parentHolder","Requestor", "StackedAreaAdapter", 
	function(Palettes,$http, parentHolder, Requestor, StackedAreaAdapter ){
	return {
		
		title : "Chart Decoration",
		
		description : "Setup chart decoration options",
        
    	html : "./widgets/v2.steps/stacked-area-chart-decoration.html",

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
	                  "useRowMetadata": this.postprocessSettings.useRowMetadata,
	                  "axisX" : this.postprocessSettings.axisX
	                  
	                },
	                "proc_name": "scatter-serie",
	                "response_type": "data"
	              };
	        this.serieRequest = this.request;      
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

		activate : function(wizard){
			
			this.postprocessSettings = wizard.conf.postprocessSettings;
			this.queryResultId = wizard.conf.queryResultId;
			this.serieRequest = wizard.conf.serieRequest;
			this.decoration = wizard.conf.decoration;

			this.makeRequest();
			var thos = this;

			new Requestor()
	        .push("getOptions",function(requestor){
	          $http.get("./widgets/nvd3-stacked-area/options.json")
	          .success(function(data){
	             thos.options = data;
                
	            if(thos.decoration){
	            	StackedAreaAdapter.applyDecoration(thos.options,thos.decoration)
	            }else{
	            	thos.decoration = StackedAreaAdapter.getDecoration(thos.options);
	            }
	            thos.decoration.width = parentHolder(thos.wizard.conf).width;
	            thos.setupOptions();	
	          //    thos.options.chart.x = function (d) { return d.label };
           //       thos.options.chart.y = function (d) { return d.value };
           //       thos.options.chart.tooltipContent: function (serie, x, y, s) {
           //    			return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>"
           //  	};
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
	                console.log(thos.data)
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
			StackedAreaAdapter.applyDecoration(this.options,this.decoration);
			this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
			// this.makeRequest();
		}	
    }
}]);    	
