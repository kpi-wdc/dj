import angular from 'angular';
// import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.nvd3-pie/pie-chart-decoration";
import "widgets/v2.nvd3-pie/adapter";

const m = angular.module('app.widgets.v2.pie-chart-wizard', [
  // 'app.widgets.v2.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.pie-chart-decoration",
  // "app.widgets.v2.pie-chart-adapter"
  ]);


m._wizard = undefined;

m.factory("PieChartWizard",["$http",
							"$modal", 
							// "NVD3WidgetV2", 
                            "Wizard",
                            "EditWidgetID",
                            "PieChartDecoration",
                            "parentHolder",
                            // "PieChartAdapter",
    function (	$http,
    			$modal, 
				// NVD3WidgetV2, 
                Wizard,
                EditWidgetID,
                PieChartDecoration,
                parentHolder
                // ,
                // PieChartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Pie Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(PieChartDecoration)


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
	            wizard.parentScope.widget.emitters = wizard.conf.emitters;

			    // wizard.parentScope.updateChart();
			    
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);
