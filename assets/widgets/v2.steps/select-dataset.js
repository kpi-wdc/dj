import angular from 'angular';

var m = angular.module("app.widgets.v2.steps.select-dataset",["ngFileUpload"]);

m.factory("SelectDataset",["$upload", '$http', '$timeout', "$lookup", "$translate",

  function($upload, $http, $timeout, $lookup, $translate){
	return {
		
		title : "Dataset",
		
		description : "Select or upload dataset",
        
    html : "./widgets/v2.steps/select-dataset.html",

    formatDate: function(date){
      var locale = $translate.use() || "en";
      date = new Date(date);
      date = date.toLocaleString(locale,
        { year: 'numeric',  
          month: 'long',  
          day: 'numeric', 
          hour: 'numeric',  
          minute: 'numeric',
          second: 'numeric'
        })
      return date;
    },

    lookup: $lookup,


    onStartWizard: function(wizard){
      this.wizard = wizard;
    	var scope = wizard.parentScope;
    	this.datasetID = wizard.conf.datasetID;
     
    	
      if( angular.isUndefined(this.datasetID)){
        this.selectedDataset = undefined;
      		wizard.process(this);
      	}
        
  		 	var thos = this;     	

      this.updateDatasetList();
  		
      scope.$watch('wizard.steps['+thos.index+'].files', function(files) {
        		scope.formUpload = false;
        		if (files != null) {
          			for (var i = 0; i < files.length; i++) {
            			scope.errorMsg = null;
            			(function(file) {
              				thos.upload(file);
            			})(files[i]);
          			}
        		}
      		});
      },

      onFinishWizard: function(wizard){
        wizard.conf.datasetID  =  this.datasetID;
      },

    updateDatasetList: function(){
    	var thos = this;
    	$http.post("./api/metadata/items")
    	.success(function (data) {
          console.log("DatasetList",data)
      		thos.datasets = data;//.reverse();

      		var selectedDS;
      		if(angular.isDefined(thos.datasetID)){
      			selectedDS = thos.datasets.filter(function(item){
              console.log(item.dataset.source,thos.lookup(item.dataset.source))
        			return item.dataset.commit.id == thos.datasetID;
      			});	
      		}
      	if (selectedDS && selectedDS.length > 0){
            thos.select(selectedDS[0])
        }
        thos.uploaded = false;  
    	})
    	.error(function (data, status) {
      		$window.alert("$http error " + status + " - cannot load data");
    	});
  	},

		upload: function (file) {
      this.uploaded = true;
			var thos = this;

			file.upload = $upload.upload({
				url: './api/data/dataSource',
				method: 'POST',
				headers: {
				  'my-header' : 'my-header-value'
				},
				file: file,
			});

			file.upload.then(function(response) {
					$timeout(function() {
					 thos.updateDatasetList();
				});
			}, function(response) {
				if (response.status > 0)
				thos.scope.errorMsg = response.status + ': ' + response.data;
			});

			file.upload.progress(function(evt) {
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
			});
		},


		select: function(dataset){
        	if(!this.datasets) return;
        	var thos = this;
        	this.datasets.forEach(function(item){
          		if(item.dataset.commit.id == dataset.dataset.commit.id){
                if (!item.selected){
              		item.selected = true;
              		thos.selectedDataset = dataset;
              		thos.datasetID = dataset.dataset.commit.id;
              		thos.wizard.complete(thos);
            		}
          		}else{
            		item.selected = false;
          		}
        	})
      	},


    activate : function(wizard){
    }	
	}
}]);	