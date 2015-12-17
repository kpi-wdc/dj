import angular from 'angular';

const appListWidget = angular.module('app.widgets.app-logo', []);

appListWidget.controller('AppLogoController', function ($scope, $window,config) {
  $scope.widget.logoURL = $scope.widget.logoURL || '/widgets/app-logo/default-logo.png';
  $scope.$watch('widget.logoURL', function (newUrl) {
    const absoluteUrlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
    if (!absoluteUrlPattern.test(newUrl)) {
      $scope.widget.logoURL = `${$window.location.origin}${newUrl}`;
    }
  });
});
