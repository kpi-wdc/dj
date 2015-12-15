import angular from 'angular';



angular.module('app.widgets.resource-manager', ['angular-clipboard'])
  
  .controller('ResourceManagerController', function ($scope, $http, $upload, EventEmitter, 
    APIProvider, APIUser, pageSubscriptions, $translate, appName,dialog,clipboard) {
    
    $scope.appName = appName;
    $scope.upload_process = true;
        

    
    $scope.copyToClipboard = function(text){
      clipboard.copyText(text);
    }

    $scope.load = function(){
      $http.get("./api/resource")
      .success(function(data){
        $scope.upload_process = false;
        $scope.resources = data;
      })
    }
      var formatDate = function(date){
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
    }

     $scope.formatDate = formatDate;

     $scope.upload = function (file) {
        $scope.upload_process = true;
        $upload.upload({
          url: './api/resource/update',
          method: 'POST',
          headers: {
            'my-header' : 'my-header-value'
          },
          fields:{app:appName},
          file: file,
        })
        .then(function() {
           $scope.load();
        });
     }

     $scope.fileSelected = function(f,e){
      var files = f;
      
      $scope.formUpload = false;
      if (files != null) {
          $scope.commits = undefined;
          for (var i = 0; i < files.length; i++) {
            $scope.errorMsg = null;
            (function(file) {
                $scope.upload(file);
            })(files[i]);
          }
      }
    };

    $scope.deleteResource = function(resource){
      $scope.upload_process = true;
      $http.get("./api/resource/delete/"+resource.path)
        .success(function(){
          $scope.upload_process = false;
          $scope.load();
        })
    }

    $scope.renameResource = function(resource){
      dialog({
          title:"Enter new resource name",
          fields:{
            oldName:{title:"Old name",value:resource.path},
            newName:{title:"New name",value:resource.path,editable:true,required:true}
          } 
      }).then(function(form){
        $scope.upload_process = true;
        $http.post("./api/resource/rename",
          { app:$scope.appName,
            oldPath:form.fields.oldName.value,
            newPath:form.fields.newName.value
          })
          .success(function(){
            $scope.load();    
          })
      })
    } 



    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.upload_process = true;
        $scope.load();
      })
      .removal(() => {
        console.log('Resource Manager widget is destroyed');
      });
  });
