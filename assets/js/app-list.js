import angular from 'angular';
import 'app-list/list';
import 'info'
import 'user'

const appList = angular.module('appList', ['app.user', 'appList.list', 'app.info']);

appList.controller('AppListController', function ($scope, $http, $window,
                                                  appList, prompt, alert,
                                                  user) {
  $scope.user = user;
  $scope.apps = appList;

  $scope.oldApps = $scope.apps;

  $scope.saveApps = () => {
    $scope.oldApps = angular.copy($scope.apps);
  }

  $scope.restoreApps = () => {
    $scope.apps = $scope.oldApps;
  }

  $scope.createApp = function () {
    const appName = $scope.model.newAppName;

    $scope.saveApps();
    $scope.apps.push({
      appName: appName,
      owner: user
    });
    $http.get(`/api/app/create/${appName}`).error((data, error) => {
      $scope.restoreApps();
      alert.error(`Error while creating the app (${error}): ${data}`);
    });
  };

  $scope.renameApp = function (appName) {
    const newAppName = prompt('New name:');
    if (!newAppName) {
      return;
    }

    $scope.saveApps();
    $scope.apps[$scope.apps.findIndex(app => appName === app.appName)].appName = newAppName;
    $http.get(`/api/app/rename/${appName}/${newAppName}/`).error((data, error) => {
      $scope.restoreApps();
      alert.error(`Error while renaming the app (${error}): ${data}`);
    });
  };

  $scope.deleteApp = function (appName) {
    if (prompt('Type again name of the app to confirm deletion: ') !== appName) {
      alert.error('Wrong name, app is not deleted!');
      return;
    }

    $scope.saveApps();
    $scope.apps.splice($scope.apps.findIndex(app => appName === app.appName), 1);
    $http.get(`/api/app/delete/${appName}`).error((data, error) => {
      $scope.restoreApps();
      alert.error(`Error while deleting the app (${error}): ${data}`);
    });
  };
});

angular.bootstrap(document, ['appList']);
