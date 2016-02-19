import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.steps/hbar-chart-decoration";
import "widgets/v2.nvd3-bar-h/adapter";


const m = angular.module('app.widgets.v2.hbar-chart-wizard', [
  'app.widgets.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.hbar-chart-decoration",
  "app.widgets.v2.hbar-chart-adapter"]);

m._wizard = undefined;

m.factory("HBarChartWizard",["$http",
							"$modal", 
							"NVD3Widget", 
                            "Wizard",
                            "EditWidgetID",
                            "HBarChartDecoration",
                            "parentHolder",
                            // "HBarChartAdapter",
    function (	$http,
    			$modal, 
				NVD3Widget, 
                Wizard,
                EditWidgetID,
                HBarChartDecoration,
                parentHolder
                // HBarChartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Horizontal BAR Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(HBarChartDecoration)


	          .onStart(function(wizard){
	          	wizard.conf = {};
	            angular.copy(wizard.parentScope.widget, wizard.conf);
	            console.log("Start conf", wizard.conf)
	          })


	          .onCancel(function(wizard){
	          	wizard.conf = {};
	            wizard.context = {};
			  })

	          .onFinish(function(wizard){
	          	wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
	            wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
	            wizard.parentScope.widget.queryID = wizard.conf.queryID;
	            wizard.parentScope.widget.dataID = wizard.conf.dataID;
	           
			    wizard.parentScope.updateChart();
			    
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);
  




// import angular from 'angular';
// import 'widgets/nvd3-widget/nvd3-widget';
// import "widgets/wizard/wizard";
// import "widgets/v2.steps/edit-widget-id";
// import "widgets/v2.steps/select-dataset";
// import "widgets/v2.steps/make-query";
// import "widgets/v2.steps/post-process";
// import "widgets/v2.steps/hbar-chart-decoration";
// import "widgets/v2.nvd3-bar-h/adapter";

// const m = angular.module('app.widgets.v2.hbar-chart-wizard', [
//   'app.widgets.nvd3-widget',
//   "app.widgets.wizard",
//   "app.widgets.v2.steps.edit-widget-id",
//   "app.widgets.v2.steps.select-dataset",
//   "app.widgets.v2.steps.make-query",
//   "app.widgets.v2.steps.post-process",
//   "app.widgets.v2.steps.hbar-chart-decoration",
//   "app.widgets.v2.hbar-chart-adapter"]);


// m._wizard = undefined;

// m.factory("HBarChartWizard",["$http",
// 							"$modal", 
// 							"NVD3Widget", 
//                             "Wizard",
//                             "EditWidgetID",
//                             "SelectDataset",
//                             "MakeQuery",
//                             "PostProcess",
//                             "HBarChartDecoration",
//                             "parentHolder",
//                             "HBarChartAdapter",
//     function (	$http,
//     			$modal, 
// 				NVD3Widget, 
//                 Wizard,
//                 EditWidgetID,
//                 SelectDataset,
//                 MakeQuery,
//                 PostProcess,
//                 BarChartDecoration,
//                 parentHolder,
//                 BarChartAdapter 
//                 ) {
//     	if (!m._wizard){
// 	    	m._wizard = 
// 	    	 new Wizard($modal)
// 	          .setTitle("Horizontal BAR Chart Settings Wizard")
// 	          .push(EditWidgetID)
// 	          .push(SelectDataset)
// 	          .push(MakeQuery)
// 	          .push(PostProcess)
// 	          .push(BarChartDecoration)


// 	          .onStart(function(wizard){
// 	          	wizard.conf = {};
// 	          	wizard.setIcon(wizard.parentScope.widget.icon);
// 	            angular.copy(wizard.parentScope.widget, wizard.conf);
// 	          })

// 	          .onCompleteStep( function(wizard,step){
// 	            if(step.title == "Dataset"){
// 	              wizard.enable(step.index+1);
// 	            }
// 	            if(step.title == "Query"){
// 	              wizard.enable(step.index+1);
// 	            }
// 	            if(step.title == "Postprocessing"){
// 	              wizard.enable(step.index+1);
// 	            }
// 	            if(step.title == "Chart Decoration"){
// 	            }
// 	          })

// 	          .onProcessStep( function(wizard,step){
// 	            if(step.title == "Dataset"){
// 	              wizard.disable(wizard.getAboveIndexes(step));
// 	              return;
// 	            }
// 	            if(step.title == "Query"){
// 	             wizard.disable(wizard.getAboveIndexes(step));
// 	            }
// 	            if(step.title == "Postprocessing"){
// 	             wizard.disable(wizard.getAboveIndexes(step));
// 	            }
// 			  })

// 	          .onCancel(function(wizard){
// 	          	wizard.conf = {};
// 	            wizard.context = {};
// 			  })

// 	          .onFinish(function(wizard){
// 	          	// wizard.parentScope.widget = {};
// 	          	// wizard.parentScope.widget = wizard.conf;
// 	          	wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
// 	            wizard.parentScope.widget.datasetID  =  wizard.conf.datasetID;
// 	            wizard.parentScope.widget.dataset  =  wizard.conf.dataset;
// 	            wizard.parentScope.widget.query  =  wizard.conf.query;
// 	            wizard.parentScope.widget.postprocessSettings  =  wizard.conf.postprocessSettings;
// 	            wizard.parentScope.widget.queryResultId = wizard.conf.queryResultId;
// 	            // wizard.parentScope.widget.postprocess  =  wizard.conf.postprocess;
// 	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
// 	            wizard.parentScope.widget.serieRequest = wizard.conf.serieRequest;
// 	            wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
	           
// 			    wizard.parentScope.updateChart();
// 			    wizard.conf = {};
// 	            wizard.context = {};
// 	          });
// 	        }
// 	        return m._wizard;  

// }]);