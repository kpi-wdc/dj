import angular from 'angular';
// import 'widgets/nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.nvd3-gantt/gantt-chart-decoration";
import "widgets/v2.nvd3-gantt/adapter";

const m = angular.module('app.widgets.v2.gantt-chart-wizard', [
  // 'app.widgets.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.gantt-chart-decoration",
  "app.widgets.v2.gantt-chart-adapter"]);


m._wizard = undefined;

m.factory("GanttChartWizard",["$http",
							"$modal", 
							// "NVD3Widget", 
                            "Wizard",
                            "EditWidgetID",
                            "GanttChartDecoration",
                            "parentHolder",
                            "GanttChartAdapter",
    function (	$http,
    			$modal, 
				// NVD3Widget, 
                Wizard,
                EditWidgetID,
                GanttChartDecoration,
                parentHolder,
                GanttChartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Gantt Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(GanttChartDecoration)


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
	            // wizard.parentScope.widget.queryID = wizard.conf.queryID;
	            wizard.parentScope.widget.dataID = wizard.conf.dataID;
	           
			    wizard.parentScope.updateChart();
			    
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);


