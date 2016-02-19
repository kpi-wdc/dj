import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-distribution/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.distribution-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    'app.widgets.v2.distribution-chart-adapter',
    "wizard-directives"]);

m.factory("DistributionChartDecoration",[
	"$http",
	"$q", 
	"parentHolder",
	"DistributionAdapter", 
	function(
		$http, 
		$q, 
		parentHolder, 
		DistributionAdapter ){
		
		let chartAdapter = DistributionAdapter;

		return {
			id: "DistributionChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.steps/distribution-chart-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			beans: (wizard.conf.beans) ? wizard.conf.beans : 5,
	                cumulate: (wizard.conf.cumulate) ? wizard.conf.cumulate : false,
	    			decoration : wizard.conf.decoration,
	    			serieRequest : wizard.conf.serieRequest,
	    			queryResultId : wizard.conf.queryResultId,
	    			serieDataId : wizard.conf.serieDataId,
	    			optionsUrl : "./widgets/v2.nvd3-distribution/options.json",
	    			dataUrl : "./api/data/process/"
	    		}	
	    	},

	    	onFinishWizard:  function(wizard){
	    		this.conf.decoration.setColor = undefined;
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.serieRequest = this.conf.serieRequest;
	    		wizard.conf.serieDataId  = this.conf.serieDataId;
	    		wizard.conf.beans = this.conf.beans;
	            wizard.conf.cumulate = this.conf.cumulate;

	    		// console.log("before step finish",wizard.conf )
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

			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){
				let r = $http.post(this.conf.dataUrl,
					{
		                "data_id": this.conf.queryResultId,
		                "params": {
		                	"beans": this.conf.beans,
	                  		"cumulate": this.conf.cumulate,
	                  		"useColumnMetadata":[true],
	                  		"useRowMetadata":[true]
	                    },
		                "proc_name": "distribution",
		                "response_type": "data"
		            }
				)
				return r
			},

			 setupOptions: function(){
				  var serieAdapter = {
		            getX: 		(d)	=> d.x,
		            getY: 		(d)	=> d.y,
		            getLabel: 	(d)	=> d.y,
		            label: 		(d)	=> d.label
		          }

		          let $scope = this;
		          let params = {serieAdapter:serieAdapter}


		          
		          for (var i in params.serieAdapter) {
                      $scope.options.chart[i] = params.serieAdapter[i];
                   }

                  chartAdapter.applyDecoration($scope.options,$scope.conf.decoration) 
                  // if($scope.widget.decoration){
                  //   $scope.decorationAdapter.applyDecoration($scope.options,$scope.widget.decoration)
                  // }else{
                  //   $scope.widget.decoration = $scope.decorationAdapter.getDecoration($scope.options);
                  // }
                  
                  if(angular.isDefined(params.serieAdapter)){
                    if (params.serieAdapter.getX) {
                      $scope.options.chart.x = params.serieAdapter.getX;
                    }

                    if (params.serieAdapter.getY) {
                      $scope.options.chart.y = params.serieAdapter.getY;
                    }

                    $scope.options.chart.label = params.serieAdapter.getLabel;

                    if ($scope.options.chart.scatter) {
                      $scope.options.chart.scatter.label = params.serieAdapter.getLabel;
                    }
                    
                    if ($scope.options.chart.lines) {
                      $scope.options.chart.lines.label = params.serieAdapter.getLabel;
                    }
                    
                    if (  $scope.options.chart.stacked 
                          && angular.isObject($scope.options.chart.stacked)) {
                      $scope.options.chart.stacked.label = params.serieAdapter.getLabel;
                    }
                  }  
		   		  
		   		  // for (var i in serieAdapter) {
	        //               this.options.chart[i] = serieAdapter[i];
	        //            }
	  
	                  
	        //           if(angular.isDefined(serieAdapter)){
	        //             if (serieAdapter.getX) {
	        //               this.options.chart.x = serieAdapter.getX;
	        //             }

	        //             if (serieAdapter.getY) {
	        //               this.options.chart.y = serieAdapter.getY;
	        //             }

	        //             this.options.chart.label = serieAdapter.getLabel;

	        //             if (this.options.chart.scatter) {
	        //               this.options.chart.scatter.label = serieAdapter.getLabel;
	        //             }
	        //             if (this.options.chart.lines) {
	        //               this.options.chart.lines.label = serieAdapter.getLabel;
	        //             }
	        //             if (this.options.chart.stacked && angular.isObject(this.options.chart.stacked)) {

	        //               this.options.chart.stacked.label = serieAdapter.getLabel;
	        //             }
	        //           }   
			   },


			activate : function(wizard){
				
				this.conf.queryResultId = wizard.context.queryResultId;
				this.dataset = wizard.context.dataset;
				let thos = this;

				if(!this.wizard.context.postprocessedTable){
					$http
			          .get("./api/data/process/"+this.conf.queryResultId)
			          .success(function (resp) {
			              thos.wizard.context.postprocessedTable = resp.value;
			               // thos.axisXList = thos.makeAxisXList(thos.wizard.context.postprocessedTable);
			          })
				}else{
					 // this.axisXList = this.makeAxisXList(this.wizard.context.postprocessedTable);
			   }

				
				this.optionsLoaded = //(this.optionsLoaded) ? this.optionsLoaded :
					this.loadOptions().then( (options) => {
						thos.options = options.data;
	                	if(!thos.conf.decoration){
			            	thos.conf.decoration = chartAdapter.getDecoration(thos.options);
			            }
		            
			            thos.conf.decoration.setColor = (palette) => {thos.conf.decoration.color = angular.copy(palette) }
			            thos.setupOptions();

			            // thos.options.chart.x = (d) => d.x;
		             //    thos.options.chart.y = (d) => d.y;
		             //    thos.options.chart.label = (d) => d.y;            
		             //    thos.options.chart.label = (d) => d.label;
                        
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
					// console.log(thos.options)
					thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
					chartAdapter.applyDecoration(thos.options,thos.conf.decoration);
					thos.settings = {options:angular.copy(thos.options), data:angular.copy(thos.data)};
				});
				
			},

			apply: function(){
				this.activate(this.wizard)
			}	
	    }
}]);    	



// 
// 
// 
// 
// 
// 

// import angular from 'angular';
// import "widgets/v2.steps/palettes";
// import 'widgets/nvd3-widget/nvd3-widget';
// import 'widgets/data-util/dps';
// import "widgets/v2.nvd3-distribution/adapter";

// var m = angular.module("app.widgets.v2.steps.distribution-chart-decoration",[
// 	"app.widgets.palettes",  
// 	'app.widgets.nvd3-widget',
//     "app.widgets.data-util.dps",
//     "app.widgets.v2.distribution-chart-adapter"]);

// m.factory("DistributionChartDecoration",[
// 	"Palettes", "$http","parentHolder","Requestor", "DistributionAdapter", 
// 	function(Palettes,$http, parentHolder, Requestor, DistributionAdapter ){
// 	return {
		
// 		title : "Chart Decoration",
		
// 		description : "Setup chart decoration options",
        
//     	html : "./widgets/v2.steps/distribution-chart-decoration.html",

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
// 	                  "beans": this.postprocessSettings.beans,
// 	                  "cumulate": this.postprocessSettings.cumulate
	                  
	                  
// 	                },
// 	                "proc_name": "distribution",
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
// 	          $http.get("./widgets/nvd3-distribution/options.json")
// 	          .success(function(data){
// 	             thos.options = data;
                
// 	            if(thos.decoration){
// 	            	DistributionAdapter.applyDecoration(thos.options,thos.decoration)
// 	            }else{
// 	            	thos.decoration = DistributionAdapter.getDecoration(thos.options);
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
// 			DistributionAdapter.applyDecoration(this.options,this.decoration);
// 			this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
// 			// this.makeRequest();
// 		}	
//     }
// }]);    	
