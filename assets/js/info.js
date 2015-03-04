import angular from 'angular';
import 'angular-foundation';

const info = angular.module('app.info', ['mm.foundation']);

info.service('alert', function ($modal, $log) {
  this.error = (msg) => {
    $log.error(msg);
    $modal.open({
      template: msg,
      windowClass: 'error-message'
    });
  };
});

info.factory('prompt', ($window) => $window.prompt);

