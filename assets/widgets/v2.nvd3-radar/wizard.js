import angular from 'angular';
// import 'widgets/nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.nvd3-radar/radar-chart-decoration";
import "widgets/v2.nvd3-radar/adapter";

const m = angular.module('app.widgets.v2.radar-chart-wizard', [
  // 'app.widgets.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.radar-chart-decoration",
  "app.widgets.v2.radar-chart-adapter"]);


m._wizard = undefined;

m.factory("RadarChartWizard",["$http",
							"$modal", 
							// "NVD3Widget", 
                            "Wizard",
                            "EditWidgetID",
                            "RadarChartDecoration",
                            "parentHolder",
                            "RadarChartAdapter",
    function (	$http,
    			$modal, 
				// NVD3Widget, 
                Wizard,
                EditWidgetID,
                RadarChartDecoration,
                parentHolder,
                RadarChartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Radar Chart Settings Wizard")
	          .push(EditWidgetID)
	          .push(RadarChartDecoration)


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


