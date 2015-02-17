angular.module('appList', ['appList.list'])
  .controller('AppListController', function ($scope, appList) {
    $scope.apps = appList;
    $scope.renameApp = function (appName) {
      $scope.apps[$scope.apps.indexOf(appName)] = 'renamed';
    };
  });
