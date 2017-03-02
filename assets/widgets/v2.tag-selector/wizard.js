import angular from 'angular';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.data-selector/data-selector-options";


const m = angular.module('app.widgets.v2.data-selector-wizard', [
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.data-selector-options"
  ]);

m._wizard = undefined;

m.factory("DataSelectorWizard",["$http",
							"$modal", 
							"Wizard",
                            "EditWidgetID",
                            "DataSelectorOptions",
                            "parentHolder",
    function (	$http,
    			$modal, 
				// NVD3WidgetV2, 
                Wizard,
                EditWidgetID,
                DataSelectorOptions,
                parentHolder
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Data Selector Settings Wizard")
	          .push(EditWidgetID)
	          .push(DataSelectorOptions)


	          .onStart(function(wizard){
	          	wizard.conf = {};
	            angular.copy(wizard.parentScope.widget, wizard.conf);
	            // console.log("Start conf", wizard.conf)
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
	           

			    // wizard.parentScope.updateChart();
			    
			    wizard.conf = {};
	            wizard.context = {};
	          });
	        }
	        return m._wizard;  

}]);
  