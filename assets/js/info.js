import angular from 'angular';
import 'angular-foundation';
import 'file-upload';

const info = angular.module('app.info', ['mm.foundation','ngFileUpload']);

info.service('alert', function ($modal, $log) {
  this.message = (msg) => {
    if(angular.isArray(msg)){
      for (let i in msg){
        $log.info(msg);
      }
    }else{
      $log.info(msg);
      msg = [msg];  
    }
    $modal.open({
      templateUrl: '/partials/alert.html',
      windowClass: 'info-modal',
      controller: 'AlertController',
      resolve: {
        msg: () => msg
      }
    });
  };

  this.error = (msg) => {
    if(angular.isArray(msg)){
      for (let i in msg){
        $log.info(msg);
      }
    }else{
      $log.error(msg);
      msg = [msg]; 
    }
    
    $modal.open({
      templateUrl: '/partials/alert.html',
      windowClass: 'info-modal',
      controller: 'AlertController',
      resolve: {
        msg: () => msg
      }
    });
  };
});

info.factory('confirm', function ($modal) {
  return text => $modal.open({
    templateUrl: '/partials/confirm.html',
    controller: 'ConfirmController',
    windowClass: 'info-modal',
    resolve: {
      text: () => text
    }
  }).result;
});

info.factory('prompt', function ($modal) {
  return (text, value) => {
    return $modal.open({
      templateUrl: '/partials/prompt.html',
      controller: 'PromptController',
      windowClass: 'info-modal',
      resolve: {
        text: () => text,
        value: () => value
      }
    }).result;
  };
});

info.factory('dialog', function ($modal) {
  return (form) => {
    return $modal.open({
      templateUrl: '/partials/dialog.html',
      controller: 'DialogController',
      windowClass: "dialog-modal",
      resolve: {
        form: () => form
      }
    }).result;
  };
});

info.factory('splash', function ($modal) {
  return (form, wait) => {
    return $modal.open({
      templateUrl: '/partials/splash.html',
      controller: 'SplashController',
      windowClass: "splash-modal",
      resolve: {
        form: () => form,
        wait: () => wait
      }
    }).result;
  };
});


info.controller('AlertController', function ($scope, msg, $modalInstance){
  $scope.msg = msg;
  $scope.close = () => {$modalInstance.dismiss()}
});

info.controller('PromptController', function ($scope, $modalInstance, text, value) {
  $scope.form = {
    text,
    value,
    dismissed: false,

    close() {
      if (!$scope.form.dismissed) {
        $modalInstance.close($scope.form.value);
      }
    },
    dismiss() {
      $scope.form.dismissed = true;
      $modalInstance.dismiss();
    }
  };
});

info.controller('DialogController', function ($scope, $modalInstance, form) {
  
  $scope.form = form;
  for(let i in form.fields){
    form.fields[i].id = Math.random().toString(36).substring(2);
    form.fields[i].editable = (angular.isDefined(form.fields[i].editable)) ? form.fields[i].editable : true; 
    form.fields[i].required = (angular.isDefined(form.fields[i].required)) ? form.fields[i].required : true;
    
    if(form.fields[i].type == "typeahead"){
      if(angular.isArray(form.fields[i].list)){
        form.fields[i].getList = (filterValue) => {
          return  form.fields[i].list.filter((item) =>
            item.toLowerCase().includes(filterValue.toLowerCase())  
          )
        }  
      }else{
        form.fields[i].getList = form.fields[i].list
      }
    }

    if(form.fields[i].type == "select"){
      form.fields[i].options = form.fields[i].options.map(
        (item,index) => {
          return (angular.isDefined(item.title)) 
                  ?(angular.isDefined(item.value)) 
                    ? item 
                    : {"title":item.title, "value":item.title}
                  :(angular.isDefined(item.value)) 
                    ? {"title":item.value, "value":item.value} 
                    : {"title":item, "value":item}
      }) 
    }

    if(form.fields[i].type == "checkgroup"){
      form.fields[i].value = form.fields[i].value.map(
        (item,index) => {
          return (angular.isDefined(item.title)) 
                  ?(angular.isDefined(item.value)) 
                    ? item 
                    : {"title":item.title, "value":false}
                  :(angular.isDefined(item.value)) 
                    ? {"title":index, "value":item.value} 
                    : {"title":item, "value":false}
      }) 
    }
  }
  
  $scope.getFieldByID = function(id){
    for(let i in form.fields){
      if(form.fields[i].id == id) return form.fields[i];
    }  
  }


  $scope.form.dismissed = false;
  
  $scope.setImportFile = function(file,node) {
      this.$apply(() => {
        $scope.getFieldByID(node.id).value = file;
      });
  };

  $scope.completed = ($scope.form.validate) ? $scope.form.validate :
    function(form){
      var f = true;
      for(let i in $scope.form.fields){
        if( $scope.form.fields[i].required 
            && $scope.form.fields[i].type != "checkbox"
          ){
          if(angular.isUndefined($scope.form.fields[i].value)){
            return false;
          }
          if($scope.form.fields[i].value.length==0){
            return false;  
          }
        }  
      }
      return  true;
    }

 
  $scope.form.close = function() {
    if (!$scope.form.dismissed) {
      $modalInstance.close($scope.form);
    }
  };


  $scope.form.dismiss = function() {
    console.log($scope.form)
    $scope.form.dismissed = true;
    $modalInstance.dismiss();
  };
  
});


info.controller('SplashController', function ($scope, $modalInstance, form, wait) {
  $scope.form = form;
  if(wait){
    setTimeout(() => {$modalInstance.dismiss();}, wait);
  }
});  

  

info.controller('ConfirmController', function ($scope, $modalInstance, text) {
  $scope.form = {
    text,

    ok() {
        $modalInstance.close(true);
    },
    dismiss() {
      $modalInstance.dismiss();
    }
  };
});
