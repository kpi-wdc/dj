import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.steps/select-dataset";
import "widgets/v2.steps/make-query";
import "widgets/v2.steps/post-process";
import "widgets/v2.steps/distribution-chart-decoration";
import "widgets/v2.nvd3-distribution/adapter";

const m = angular.module('app.widgets.v2.distribution-chart-wizard', [
  'app.widgets.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.select-dataset",
  "app.widgets.v2.steps.make-query",
  "app.widgets.v2.steps.post-process",
  "app.widgets.v2.steps.distribution-chart-decoration",
  "app.widgets.v2.distribution-chart-adapter"]);


m._wizard = undefined;

m.factory("DistributionChartWizard",["$http",
							"$modal", 
							"NVD3Widget", 
                            "Wizard",
                            "EditWidgetID",
                            "SelectDataset",
                            "MakeQuery",
                            "PostProcess",
                            "DistributionChartDecoration",
                            "parentHolder",
                            "DistributionAdapter",
    function (	$http,
    			$modal, 
				NVD3Widget, 
                Wizard,
                EditWidgetID,
                SelectDataset,
                MakeQuery,
                PostProcess,
                DistributionChartDecoration,
                parentHolder,
                DistributionAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Distribution Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(SelectDataset)
	          .push(MakeQuery)
	          .push(PostProcess)
	          .push(DistributionChartDecoration)


	          .onStart(function(wizard){
	          	wizard.conf = {};
	          	wizard.setIcon(wizard.parentScope.widget.icon);
	            angular.copy(wizard.parentScope.widget, wizard.conf);
	          })

	          .onCompleteStep( function(wizard,step){
	            if(step.title == "Dataset"){
	              wizard.enable(step.index+1);
	            }
	            if(step.title == "Query"){
	              wizard.enable(step.index+1);
	            }
	            if(step.title == "Postprocessing"){
	              wizard.enable(step.index+1);
	            }
	            if(step.title == "Chart Decoration"){
	            }
	          })

	          .onProcessStep( function(wizard,step){
	            if(step.title == "Dataset"){
	              wizard.disable(wizard.getAboveIndexes(step));
	              return;
	            }
	            if(step.title == "Query"){
	             wizard.disable(wizard.getAboveIndexes(step));
	            }
	            if(step.title == "Postprocessing"){
	             wizard.disable(wizard.getAboveIndexes(step));
	            }
			  })

	          .onCancel(function(wizard){
	          	wizard.conf = {};
	            wizard.context = {};
			  })

	          .onFinish(function(wizard){
	          	wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
	            wizard.parentScope.widget.datasetID  =  wizard.conf.datasetID;
	            wizard.parentScope.widget.dataset  =  wizard.conf.dataset;
	            wizard.parentScope.widget.query  =  wizard.conf.query;
	            wizard.parentScope.widget.postprocessSettings  =  wizard.conf.postprocessSettings;
	            wizard.parentScope.widget.queryResultId = wizard.conf.queryResultId;
	            
	            wizard.parentScope.widget.beans = wizard.conf.beans;
	            wizard.parentScope.widget.cumulate = wizard.conf.cumulate;
	           

	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
	            wizard.parentScope.widget.serieRequest = wizard.conf.serieRequest;
	            wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
	           
	           
			    wizard.parentScope.updateChart();
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);




// 
// 
// 
// 


// import angular from 'angular';
// import 'widgets/nvd3-widget/nvd3-widget';
// import 'widgets/data-util/dps';
// import "widgets/wizard/wizard";
// import "widgets/v2.steps/edit-widget-id";
// import "widgets/v2.steps/select-dataset";
// import "widgets/v2.steps/make-query";
// import "widgets/v2.steps/distribution-post-process";
// import "widgets/v2.steps/distribution-chart-decoration";
// import "widgets/v2.nvd3-distribution/adapter";

// const m = angular.module('app.widgets.v2.distribution-chart-wizard', [
//   'app.widgets.nvd3-widget',
//   "app.widgets.data-util.dps",
//   "app.widgets.wizard",
//   "app.widgets.v2.steps.edit-widget-id",
//   "app.widgets.v2.steps.select-dataset",
//   "app.widgets.v2.steps.make-query",
//   "app.widgets.v2.steps.distribution-post-process",
//   "app.widgets.v2.steps.distribution-chart-decoration",
//   "app.widgets.v2.distribution-chart-adapter"]);

// m._wizard = undefined;


// m.factory("DistributionChartWizard",["$http",
// 							"$modal", 
// 							"NVD3Widget", 
//                             "Requestor", 
//                             "Wizard",
//                             "EditWidgetID",
//                             "SelectDataset",
//                             "MakeQuery",
//                             "DistributionPostProcess",
//                             "DistributionChartDecoration",
//                             "parentHolder",
//                             "DistributionAdapter",
//     function (	$http,
//     			$modal, 
// 				NVD3Widget, 
//                 Requestor, 
//                 Wizard,
//                 EditWidgetID,
//                 SelectDataset,
//                 MakeQuery,
//                 DistributionPostProcess,
//                 DistributionChartDecoration,
//                 parentHolder,
//                 DistributionAdapter 
//                 ) {
//     	if (!m._wizard){
// 	    	m._wizard = 
// 	    	 new Wizard($modal)
// 	          .setTitle("DISTRIBUTION Chart Settings Wizard")
// 	          .push(EditWidgetID)
// 	          .push(SelectDataset)
// 	          .push(MakeQuery)
// 	          .push(DistributionPostProcess)
// 	          .push(DistributionChartDecoration)


// 	          .onStart(function(wizard){
// 	            wizard.conf = angular.copy(wizard.parentScope.widget);
// 	          })

// 	          .onCompleteStep( function(wizard,step){
// 	            if(step.title == "Dataset"){
// 	              wizard.conf.dataset = step.selectedDataset;
// 	              wizard.enable(step.index+1);
// 	            }
// 	            if(step.title == "Query"){
// 	              wizard.conf.query = step.query;
// 	              wizard.enable(step.index+1);
// 	            }
// 	            if(step.title == "Postprocessing"){
// 	              wizard.conf.postprocessSettings = step.postprocessSettings;
// 	              wizard.conf.queryResultId = step.queryResultId
// 	              wizard.enable(wizard.getAboveIndexes(step));
// 	            }
// 	            if(step.title == "Chart Decoration"){
// 	              wizard.conf.serieRequest = step.request;
// 	            }
// 	          })

// 	          .onProcessStep( function(wizard,step){
// 	            if(step.title == "Dataset"){
// 	              wizard.conf.query = undefined;
// 	              wizard.disable(wizard.getAboveIndexes(step));
// 	              return;
// 	            }
// 	            if(step.title == "Query"){
// 	             wizard.conf.postprocessSettings = undefined;
// 	             wizard.conf.serieRequest = undefined;
// 	             wizard.disable(wizard.getAboveIndexes(step));
// 	            }
// 	            if(step.title == "Postprocessing"){
// 	              wizard.conf.serieRequest = undefined;
// 	            }
// 			  })

// 	          .onCancel(function(wizard){
// 	          })

// 	          .onFinish(function(wizard){
// 	            wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
// 	            wizard.parentScope.widget.datasetID  =  wizard.conf.datasetID;
// 	            wizard.parentScope.widget.query  =  wizard.conf.query;
// 	            wizard.parentScope.widget.postprocessSettings  =  wizard.conf.postprocessSettings;
// 	            wizard.parentScope.widget.postprocess  =  wizard.conf.postprocess;
// 	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
// 	            wizard.parentScope.widget.serieRequest = wizard.conf.serieRequest;
// 	            wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
// 	            // wizard.parentScope.widget.stacked = wizard.conf.stacked;
	            
// 	            wizard.parentScope.updateChart();
// 	          });
// 	        }
// 	        return m._wizard;  

// }]);
//   