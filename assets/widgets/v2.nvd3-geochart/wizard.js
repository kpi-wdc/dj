import angular from 'angular';
// import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.nvd3-geochart/geochart-decoration";
import "widgets/v2.nvd3-geochart/adapter";


const m = angular.module('app.widgets.v2.geochart-wizard', [
  // 'app.widgets.v2.nvd3-widget',
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.geochart-decoration",
  "app.widgets.v2.geochart-adapter"]);

m._wizard = undefined;

m.factory("GeochartWizard",["$http",
							"$modal", 
							// "NVD3WidgetV2", 
                            "Wizard",
                            "EditWidgetID",
                            "GeochartDecoration",
                            "parentHolder",
                            "GeochartAdapter",
    function (	$http,
    			$modal, 
				// NVD3WidgetV2, 
                Wizard,
                EditWidgetID,
                GeochartDecoration,
                parentHolder,
                GeochartAdapter 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Geochart Settings Wizard")
	          .push(EditWidgetID)
	          .push(GeochartDecoration)


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


	            wizard.parentScope.widget.direction =  wizard.conf.direction;
            	wizard.parentScope.widget.dataIndex =  wizard.conf.dataIndex;
    			wizard.parentScope.widget.bins =  wizard.conf.bins;
    			wizard.parentScope.widget.scope =  wizard.conf.scope;
    			wizard.parentScope.widget.emitters = wizard.conf.emitters;
	           
			    // wizard.parentScope.updateChart();
			    
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);
  