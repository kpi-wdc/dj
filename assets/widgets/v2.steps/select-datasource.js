import angular from 'angular';

var m = angular.module("app.widgets.v2.steps.select-datasource",[]);

m.factory("SelectDatasource",["$upload", '$http', function($upload, $http){
	return {
		
		title : "Datasource",
		
		description : "Select or upload datasource",
        
        html : "./widgets/v2.steps/select-datasource.html",


		onStartWizard: function(wizard){
			this.wizard = wizard;
		 	var scope = wizard.parentScope;
		 	
		 	if( angular.isUndefined(wizard.conf.datasourceID)){
		 		wizard.process(this);
		 	}else{
		 		this.datasourceID = wizard.conf.datasourceID; 
		 	}

		 	var thos = this;     	
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

        updateDatasourceList: function(){
        	var thos = this;
        	$http.get("./api/data/dataSources/")
        	.success(function (data) {
          		thos.dataSources = data.reverse();
          		var selectedDS;
          		if(angular.isDefined(thos.datasourceID)){
          			selectedDS = thos.datasources.filter(function(item){
            			return item.id == thos.datasourceID;
          			});	
          		}
          		
		        if (selectedDS && selectedDS.length > 0){
		            thos.selectDataSource(selectedDS[0])
		        }  
        	})
        	.error(function (data, status) {
          		$window.alert("$http error " + status + " - cannot load data");
        	});
      	},

		upload: function (file) {
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
					thos.updateDatasourceList();
				});
			}, function(response) {
				if (response.status > 0)
				thos.scope.errorMsg = response.status + ': ' + response.data;
			});

			file.upload.progress(function(evt) {
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			console.log(file)
			});

			file.upload.xhr(function(xhr) {
			});
		},


		select: function(datasource){
        	if(!this.dataSources) return;
        	var thos = this;
        	this.dataSources.forEach(function(item){
          		if(item.id == datasource.id){
            		item.selected = true;
            		thos.selectedDataSource = datasource;
            		thos.datasourceID = datasource.id;
            		this.wizard.complete(this);
            		
          		}else{
            		item.selected = false;
          		}
        	})
      	},


        activate : function(wizard){
        	
        	if( !this.dataSources ) {
        		this.updateDatasourceList;
        	}	
        }	
	}
}]);	