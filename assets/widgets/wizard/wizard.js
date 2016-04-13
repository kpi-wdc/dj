import angular from 'angular';
import 'angular-oclazyload';

var m = angular.module("app.widgets.wizard",['oc.lazyLoad']);

m.factory("Wizard",["$ocLazyLoad", function($ocLazyLoad){
	
	$ocLazyLoad.load({
      files: ["./widgets/wizard/styles.css"]
    });
	
	var Wizard = function(modalInstance){
		this.steps = [];
		this.context = {};
		this.currentStepIndex;
		this.modalInstance = modalInstance;
		this.title = "Settings Wizard"
	}

	Wizard.prototype = {
		
		getAboveIndexes : function(step){
			var result = [];
			for(var i=step.index+1; i < this.steps.length; i++){
				result.push(i);
			}
			return result;	
		},

		getBelowIndexes : function(step){
			var result = [];
			for(var i=step.index-1; i >= 0 ; i--){
				result.push(i);
			}
			return result;	
		},

		getWithoutIndexes : function(step){
			var result = [];
			for(var i=0; i < this.steps.length ; i++){
				if ( i!= step.index ) result.push(i);
			}
			return result;	
		},

		getSteps : function(callback){
			return this.steps.filter((item) => callback(item))
		},

		setContext : function(context){
			this.context = context;
			return this;
		},

		setTitle : function(title){
			this.title = title;
			return this;
		},

		setIcon : function(icon){
			this.icon = icon;
			return this;
		},  
		
		push : function (step){
			step.enabled = true;
			step.active = false;
			step.index = this.steps.length;
			step.activationCount = 0; 
			this.steps.push(step);

			return this;
		},

		complete : function(step){
			// console.log("W complete", step)
			if ( this.onCompleteStepCallback ) this.onCompleteStepCallback(this,step);
		},

		process : function(step){
			if ( this.onProcessStepCallback ) this.onProcessStepCallback(this,step);
		},

		enable : function(stepIndexes){
			var thos = this;
			if(angular.isUndefined(stepIndexes)) return;
			stepIndexes = (angular.isUndefined(stepIndexes.length)) ? [stepIndexes] : stepIndexes;
			stepIndexes.forEach(function(currentStepIndex){
				if (thos.steps[currentStepIndex]){
					thos.steps[currentStepIndex].enabled = true;
					if( thos.steps[currentStepIndex].enable ) 
					thos.steps[currentStepIndex].enable(thos);
				}
			});	 			
		},

		disable : function(stepIndexes){
			var thos = this;
			if(angular.isUndefined(stepIndexes)) return;
			stepIndexes = (angular.isUndefined(stepIndexes.length)) ? [stepIndexes] : stepIndexes;
			stepIndexes.forEach(function(currentStepIndex){
				if (thos.steps[currentStepIndex]){
					thos.steps[currentStepIndex].enabled = false;
					if( thos.steps[currentStepIndex].disable ) 
					thos.steps[currentStepIndex].disable(thos);
				}
			});	
		},

		activate : function(stepIndex){
			if 	( 	this.steps[stepIndex] 
				&& 	this.steps[stepIndex].enabled
				// && 	this.steps[stepIndex].activate
				&&  this.currentStepIndex != stepIndex){ 
					
					if ( angular.isDefined(this.currentStepIndex) ) 
						this.steps[this.currentStepIndex].active = false;
					
					this.currentStepIndex = stepIndex;
					this.steps[stepIndex].active = true;
					this.steps[stepIndex].activationCount++;
					if (this.steps[stepIndex].activate) this.steps[stepIndex].activate(this);
			
			}
		},

		next : function(){
			if(this.steps.length > this.currentStepIndex)
				this.activate(this.currentStepIndex+1);
		},

		prev : function(){
			if(0 < this.currentStepIndex)
				this.activate(this.currentStepIndex-1);
		},

		onStart : function(onStartCallback){
			this.onStartCallback = onStartCallback;
			return this;
		},

		onCompleteStep : function(onCompleteStepCallback){
			this.onCompleteStepCallback = onCompleteStepCallback;
			return this;
		},

		onProcessStep : function(onProcessStepCallback){
			this.onProcessStepCallback = onProcessStepCallback;
			return this;
		},

		onFinish : function(onFinishCallback){
			this.onFinishCallback = onFinishCallback;
			return this;
		},

		onCancel :  function(onCancelCallback){
			this.onCancelCallback = onCancelCallback;
			return this;
		},

		start : function(parentScope){
			var thos = this;
			this.parentScope = parentScope;
			parentScope.wizard = this;

			if ( this.onStartCallback ) this.onStartCallback(this);
			
			this.steps.forEach(function (step){
				if (step.onStartWizard) step.onStartWizard(thos);
			});
			
			this.activate(0);
			
			
			var s = this.parentScope;
	        
	        return this.modalInstance.open({
	          templateUrl: 'widgets/wizard/wizard.html',
	          controller: 'WizardController',
	          backdrop: 'static',
	          resolve: {
	            widgetScope: function () {
	              		return s;
	            	}
	          	}
	         }).result
	        // .result.then(function (newWidgetConfig) {});
		},

		finish : function(){
			var thos = this;
			this.steps.forEach(function (step){
				if (step.onFinishWizard) step.onFinishWizard(thos);
			});
			if ( this.onFinishCallback ) this.onFinishCallback(this);
		},

		cancel : function(){
			var thos = this;
			this.steps.forEach(function (step){
				if (step.onCancelWizard) step.onCancelWizard(thos);
			});
			if ( this.onCancelCallback ) this.onCancelCallback(this);
		}

	}
	return Wizard;
}]);


m.controller('WizardController', function ($scope, $modalInstance, widgetScope) {
  $scope.wizard = widgetScope.wizard;

  $scope.finish = function () {
  	$scope.wizard.finish();
    $modalInstance.close();
  };

  $scope.cancel = function () {
  	$scope.wizard.cancel();
    $modalInstance.dismiss();
  };
 });