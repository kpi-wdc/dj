"use strict";

define(["angular", "widgets/data-util/keyset", "widgets/data-util/adapter", "angular-foundation", "widgets/data-dialogs/palettes1"], function (angular) {
  var m = angular.module("app.widgets.data-dialogs.datasource-dialog", ["app.widgets.data-util.keyset", "app.widgets.data-util.adapter", "mm.foundation", "app.widgetApi", "app.widgets.palettes1", "ngFileUpload"]);

  m.factory("DatasourceDialog", ["KeySet", "TableGenerator", "ScatterSerieGenerator", 
    "$modal", "APIUser", "APIProvider", "pageSubscriptions", 
    "pageWidgets", "Palettes1", "Normalizer", "$upload", '$http', "$timeout",

    function (KeySet, TableGenerator, ScatterSerieGenerator, 
      $modal, APIUser, APIProvider, pageSubscriptions, 
      pageWidgets, Palettes1, Normalizer, $upload, $http, $timeout) {

    var DatasourceDialog = function DatasourceDialog(scope) {
      var thos = this;
      this.scope = scope;
      this.conf = {};

       scope.$watch('dialog.files', function(files) {
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
      

      this.updateDatasourceList();
      this.conf.instanceName = scope.widget.instanceName;
      this.conf.url = scope.widget.url;
      
    };

    DatasourceDialog.prototype = {

     
      saveState: function(){
          this.scope.widget.url = this.conf.url;
          this.modal.close();
          this.scope.APIUser.invoke(this.scope.widget.instanceName, APIProvider.RECONFIG_SLOT);
      },

      updateDatasourceList: function(){
        var thos = this;
        $http.get("./api/data/dataSources/").success(function (data) {
          thos.ds= data;  
        })
        .error(function (data, status) {
          $window.alert("$http error " + status + " - cannot load data");
        });
      },

      selectDataSource: function(datasource){
        if (this.conf.dataID == datasource.id) return;
        if(!this.ds) return;
        var thos = this;
        this.ds.forEach(function(item){
          if(item.id == datasource.id){
            item.selected = true;
            thos.conf.dataID = datasource.id;
            thos.getDatasetURL(datasource)
          }else{
            item.selected = false;
          }
        })
      },

      getDatasetURL: function(dataset){
        if (dataset.url) {
          this.conf.url = dataset.url;
        }
        var thos = this;

        $http.post("./api/data/process/",
              {
                  "data_id": dataset.id,
                  "proc_name": "json2jsonstat",
                  "response_type": "data"
              }
          ).success(function (data) {
            console.log(data)
           thos.conf.url = "./api/data/process/"+data.data_id
        })
        .error(function (data, status) {
          $window.alert("$http error " + status + " - cannot load data");
        });

      },

      getStyle: function (dataset) {
        if (this.conf.dataID == dataset.id) {
          return { "background-color": "rgba(170, 200, 210, 0.43)" };
        } else {
          return {};
        }
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
          console.log(response);
          thos.updateDatasourceList();
          // file.result = response.data;
        });
      }, function(response) {
        if (response.status > 0)
          thos.scope.errorMsg = response.status + ': ' + response.data;
      });

      file.upload.progress(function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function(xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    },



      open: function open() {
        //this.restoreState(this.scope.widget.data,this.scope.provider)
        var s = this.scope;
       
        $modal.open({
          templateUrl: "widgets/data-dialogs/datasource-dialog.html",
          controller: "DatasourceConfigDialog",
          backdrop: "static",
          resolve: {
            widgetScope: function widgetScope() {
              return s;
            }
          }
        }).result.then(function (newWidgetConfig) {});
      }
    };

    return DatasourceDialog;
  }]);

  m.controller("DatasourceConfigDialog", ["$scope", "$modalInstance", "widgetScope", function ($scope, $modalInstance, widgetScope) {
    $scope.dialog = widgetScope.dialog;
    widgetScope.dialog.modal = $modalInstance;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };
  }]);
});
/*angular.extend(data, $scope.basicProperties)*/
