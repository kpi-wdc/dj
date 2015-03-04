import angular from 'angular';
import 'js/info'
import 'appList.list';
import 'user'

const appList = angular.module('appList', ['app.user', 'appList.list', 'app.info']);

appList.controller('AppListController', function ($scope, $http, $window,
                                                  appList, prompt, alert,
                                                  user) {
  $scope.user = user;
  $scope.apps = appList;

  $scope.createApp = function () {
    const appName = $scope.model.newAppName;

    $scope.apps.push({
      appName: appName,
      owner: user
    });
    $http.get(`/api/app/create/${appName}`).error((data, error) => {
      alert.error(`Error while creating the app (${error}): ${data}`);
    });
  };

  $scope.renameApp = function (appName) {
    const newAppName = prompt('New name:');
    if (!newAppName) {
      return;
    }
    $scope.apps[$scope.apps.findIndex(app => appName === app.appName)].appName = newAppName;
    $http.get(`/api/app/rename/${appName}/${newAppName}/`).error((data, error) => {
      alert.error(`Error while renaming the app (${error}): ${data}`);
    });
  };

  $scope.deleteApp = function (appName) {
    if (prompt('Type again name of the app to confirm deletion: ') !== appName) {
      alert.error('Wrong name, app is not deleted!');
      return;
    }

    $scope.apps.splice($scope.apps.findIndex(app => appName === app.appName), 1);
    $http.get(`/api/app/delete/${appName}`).error((data, error) => {
      alert.error(`Error while deleting the app (${error}): ${data}`);
    });
  };
});

angular.bootstrap(document, ['appList']);
