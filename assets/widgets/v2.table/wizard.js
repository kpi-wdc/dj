import angular from 'angular';
import "widgets/wizard/wizard";
import "widgets/v2.steps/edit-widget-id";
import "widgets/v2.steps/table-decoration";


const m = angular.module('app.widgets.v2.table-wizard', [
  "app.widgets.wizard",
  "app.widgets.v2.steps.edit-widget-id",
  "app.widgets.v2.steps.table-decoration"]);

m._wizard = undefined;

m.factory("TableWizard",["$http",
							"$modal", 
                            "Wizard",
                            "EditWidgetID",
                            "TableDecoration",
                            "parentHolder",
    function (	$http,
    			$modal, 
				Wizard,
				EditWidgetID,
                TableDecoration,
                parentHolder 
                ) {
    	if (!m._wizard){
	    	m._wizard = 
	    	 new Wizard($modal)
	          .setTitle("Table Settings Wizard")
	          .push(EditWidgetID)
	          .push(TableDecoration)


	          .onStart(function(wizard){
	          	wizard.conf = {};
	            angular.copy(wizard.parentScope.widget, wizard.conf);
	          })


	          .onCancel(function(wizard){
	          	wizard.conf = {};
	            wizard.context = {};
			  })

	          .onFinish(function(wizard){
	          	wizard.parentScope.widget.instanceName  =  wizard.conf.instanceName;
	            wizard.parentScope.widget.decoration = wizard.conf.decoration;
	            wizard.parentScope.widget.dataID = wizard.conf.dataID;
	             wizard.parentScope.widget.script = wizard.conf.script;
	            wizard.parentScope.widget.queryID = wizard.conf.queryID;
	            wizard.parentScope.widget.emitters = wizard.conf.emitters;
			    
			    // console.log("Finish",wizard.parentScope.widget);

			    wizard.conf = {};
	            wizard.context = {};
	            wizard.parentScope.update();
	          });
	        }
	        return m._wizard;  

}]);
  