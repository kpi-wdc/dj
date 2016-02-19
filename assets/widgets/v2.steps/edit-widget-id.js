import angular from 'angular';

var m = angular.module("app.widgets.v2.steps.edit-widget-id",[]);

m.factory("EditWidgetID",function(){
	return {
		
		id: "EditWidgetID",
		
		title : "Widget ID",
		
		description : "Edit widget ID if needed",
        
        html : "./widgets/v2.steps/edit-widget-id.html",
		
		onStartWizard: function(wizard){
		      	this.instanceName = wizard.conf.instanceName;
        },

        onFinishWizard: function(wizard){
        	wizard.conf.instanceName = this.instanceName;
        	// this.instanceName = undefined;	
        }
	}
});	
