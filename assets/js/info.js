import angular from 'angular';
import 'angular-foundation';

const info = angular.module('app.info', ['mm.foundation']);

info.service('alert', function ($modal, $log) {
  this.message = (msg) => {
    $log.info(msg);
    $modal.open({
      template: msg
    });
  };

  this.error = (msg) => {
    $log.error(msg);
    $modal.open({
      template: msg,
      windowClass: 'error-message'
    });
  };
});

info.factory('prompt', function ($modal) {
  return (text, value) => {
    return $modal.open({
      templateUrl: '/partials/prompt.html',
      controller: 'PromptController',
      resolve: {
        text: () => text,
        value: () => value
      }
    }).result;
  };
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
