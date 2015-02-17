angular.module('appList', ['appList.list'])
  .controller('AppListController', function ($scope, $http, appList) {
    $scope.apps = appList;

    $scope.renameApp = function (appName) {
      let newAppName = prompt('New name:');
      $scope.apps[$scope.apps.indexOf(appName)] = newAppName;
      $http.get(`/api/app/rename/${appName}/${newAppName}/`).success(function (appNames) {
        $scope.apps = appNames;
      }).error(function (error) {
        console.log(`Error while renaming the app: ${error}`);
      });
    };

    $scope.deleteApp = function (appName) {
      delete $scope.apps[$scope.apps.indexOf(appName)];
      $http.get(`/api/app/delete/${appName}`).success(function (appNames) {
        $scope.apps = appNames;
      }).error(function (error) {
        console.log(`Error while deleting the app: ${error}`);
      });
    };
  });
