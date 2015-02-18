angular.module('appList', ['appList.list'])
  .controller('AppListController', function ($scope, $http, $window, appList) {
    $scope.apps = appList;

    $scope.createApp = function () {
      let appName = $scope.model.newAppName;

      $scope.apps.push(appName);
      $http.get(`/api/app/create/${appName}`).success(function (appNames) {
        $scope.apps = appNames;
      }).error(function (error) {
        console.log(`Error while creating the app: ${error}`);
      });
    };

    $scope.renameApp = function (appName) {
      let newAppName = prompt('New name:');
      if (!newAppName) {
        return;
      }
      $scope.apps[$scope.apps.indexOf(appName)] = newAppName;
      $http.get(`/api/app/rename/${appName}/${newAppName}/`).success(function (appNames) {
        $scope.apps = appNames;
      }).error(function (error) {
        console.log(`Error while renaming the app: ${error}`);
      });
    };

    $scope.deleteApp = function (appName) {
      if ($window.prompt('Type again name of the app to confirm deletion: ') !== appName) {
        $window.alert('Wrong name, app is not deleted!');
        return;
      }

      $scope.apps.splice($scope.apps.indexOf(appName), 1);
      $http.get(`/api/app/delete/${appName}`).success(function (appNames) {
        $scope.apps = appNames;
      }).error(function (error) {
        console.log(`Error while deleting the app: ${error}`);
      });
    };
  });
