import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.nvd3-line/line-chart-decoration";
import "widgets/v2.nvd3-line/adapter";

const m = angular.module('app.widgets.v2.line-chart-wizard', [
  'app.widgets.v2.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.line-chart-decoration",
  "app.widgets.v2.line-chart-adapter"]);


m._wizard = undefined;

m.factory("LineChartWizard",["$http",
							"$modal", 
							"NVD3WidgetV2", 
                            "Wizard",
                            "EditWidgetID",
                            "LineChartDecoration",
                            "parentHolder",
                            "LineChartAdapter",
    function (	$http,
    			$modal, 
				NVD3WidgetV2, 
                Wizard,
                EditWidgetID,
                LineChartDecoration,
                parentHolder,
                LineChartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Line Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(LineChartDecoration)


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
	              wizard.parentScope.widget.script = wizard.conf.script;
	            wizard.parentScope.widget.axisX = wizard.conf.axisX;
	            wizard.parentScope.widget.category = wizard.conf.category;
	            wizard.parentScope.widget.index = wizard.conf.index;
	            wizard.parentScope.widget.emitters = wizard.conf.emitters;
	            // console.log(wizard.conf)
	            // console.log(wizard.parentScope.widget) 
	           
			    // wizard.parentScope.updateChart();
			    
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
// // import "widgets/v2.steps/select-dataset";
// // import "widgets/v2.steps/make-query";
// // import "widgets/v2.steps/post-process";
// import "widgets/v2.steps/line-chart-decoration";
// import "widgets/v2.nvd3-line/adapter";

// const m = angular.module('app.widgets.v2.line-chart-wizard', [
//   'app.widgets.nvd3-widget',
//   "app.widgets.wizard",
//   "app.widgets.v2.steps.edit-widget-id",
//   // "app.widgets.v2.steps.select-dataset",
//   // "app.widgets.v2.steps.make-query",
//   // "app.widgets.v2.steps.post-process",
//   "app.widgets.v2.steps.line-chart-decoration",
//   "app.widgets.v2.line-chart-adapter"]);


// m._wizard = undefined;

// m.factory("LineChartWizard",["$http",
// 							"$modal", 
// 							"NVD3Widget", 
//                             "Wizard",
//                             "EditWidgetID",
//                             // "SelectDataset",
//                             // "MakeQuery",
//                             // "PostProcess",
//                             "LineChartDecoration",
//                             "parentHolder",
//                             "LineChartAdapter",
//     function (	$http,
//     			$modal, 
// 				NVD3Widget, 
//                 Wizard,
//                 EditWidgetID,
//                 // SelectDataset,
//                 // MakeQuery,
//                 // PostProcess,
//                 LineChartDecoration,
//                 parentHolder,
//                 LineChartAdapter 
//                 ) {
//     	if (!m._wizard){
// 	    	m._wizard = 
// 	    	 new Wizard($modal)
// 	          .setTitle("Line Chart Settings Wizard")
// 	          .push(EditWidgetID)
// 	          // .push(SelectDataset)
// 	          // .push(MakeQuery)
// 	          // .push(PostProcess)
// 	          .push(LineChartDecoration)


// 	          .onStart(function(wizard){
// 	          	wizard.conf = {};
// 	            angular.copy(wizard.parentScope.widget, wizard.conf);
// 	            console.log("Start conf", wizard.conf)
// 	          })


// 	          .onCancel(function(wizard){
// 	          	wizard.conf = {};
// 	            wizard.context = {};
// 			  })

// 	          .onFinish(function(wizard){
// 	          	wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
// 	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
// 	            wizard.parentScope.widget.serieDataId = wizard.conf.serieDataId;
// 	            wizard.parentScope.widget.queryID = wizard.conf.queryID;
// 	            wizard.parentScope.widget.dataID = wizard.conf.dataID;
// 	            wizard.parentScope.widget.axisX = wizard.conf.axisX;
	           
// 			    wizard.parentScope.updateChart();
			    
// 			    wizard.conf = {};
// 	            wizard.context = {};
// 	          });
// 	        }
// 	        return m._wizard;  

// }]);
