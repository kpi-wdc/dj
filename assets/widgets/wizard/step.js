import angular from 'angular';

var m = angular.module("app.widgets.wizard.step",[]);

m.factory("Step",function(){
	return {
              title:"Step 1",
              description: "Select or upload dataset...", 
              html:"./widgets/wizard/s1.html",

              onStartWizard: function(wizard){
              	console.log("On start wizard step callback you can restore state from wizard", wizard)
              },

              onFinishWizard: function(wizard){
              	console.log("On finish wizard step callback you can set wizard state", wizard," from step context",this)
              },

              onCancelWizard: function(wizard){
              	console.log("On cancel wizard step callback you can set wizard state", wizard," from step context",this)
              },
              
              enable:function(wizard){
                console.log("Enable Step 1");
              },

              disable:function(wizard){
                console.log("Disable Step 1");
              },

              activate : function(wizard){
                // wizard.disable(2)
                console.log("Activate Step 1");
                wizard.process(this);
              }
            }

});	
