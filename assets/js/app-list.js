import angular from 'angular';
import 'appList.list';

const appList = angular.module('appList', ['appList.list']);

appList.controller('AppListController', function ($scope, $http, $window, appList) {
  $scope.apps = appList;

  $scope.createApp = function () {
    const appName = $scope.model.newAppName;

    $scope.apps.push({
      appName: appName,
      owner: {
        name: 'You',
        email: 'your-email@gmail.com'
      }
    });
    $http.get(`/api/app/create/${appName}`).error(error => {
      console.log(`Error while creating the app: ${error}`);
    });
  };

  $scope.renameApp = function (appName) {
    const newAppName = prompt('New name:');
    if (!newAppName) {
      return;
    }
    $scope.apps[$scope.apps.findIndex(app => appName === app.appName)].appName = newAppName;
    $http.get(`/api/app/rename/${appName}/${newAppName}/`).error(error => {
      console.log(`Error while renaming the app: ${error}`);
    });
  };

  $scope.deleteApp = function (appName) {
    if ($window.prompt('Type again name of the app to confirm deletion: ') !== appName) {
      $window.alert('Wrong name, app is not deleted!');
      return;
    }

    $scope.apps.splice($scope.apps.findIndex(app => appName === app.appName), 1);
    $http.get(`/api/app/delete/${appName}`).error(error => {
      console.log(`Error while deleting the app: ${error}`);
    });
  };
});

angular.bootstrap(document, ['appList']);
