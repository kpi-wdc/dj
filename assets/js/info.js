import angular from 'angular';
import 'angular-foundation';

const info = angular.module('app.info', ['mm.foundation']);

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
  $scope.form.dismissed = false;
  
  $scope.completed = function(){
    var f = true;
    for(let i in $scope.form.fields){
      if($scope.form.fields[i].required){
        if(!$scope.form.fields[i].value){
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
