import angular from 'angular';
import 'widgets/data-util/json-stat-data-provider';
import 'widgets/data-dialogs/bar-chart-dialog';
import 'widgets/data-util/adapter';

const m = angular.module('app.widgets.datasource', ['app.widgetApi',
  'app.widgets.data-util.json-stat-data-provider']);

m.controller('DataSourceController',
  function ($scope, $http, $window, APIUser, EventEmitter, APIProvider, JSONstatDataProvider) {

    var eventEmitter = new EventEmitter($scope);
    var apiUser = new APIUser($scope);
    $scope.url = $scope.widget.url;


    $scope.load = function () {

      $http.get($scope.url).success(
        function (data) {

          $scope.data = data;
          if (JSONstatDataProvider.isCompatible(data)) {
            $scope.provider = new JSONstatDataProvider($scope.data, $scope.url);
            $scope.info = $scope.provider.getDatasets();
            eventEmitter.emit('loadDataSuccess', $scope.provider);
          } else {
            alert("Not supported data format")
          }
        }
      ).error(function (data, status) {
          $window.alert('$http error ' + status + ' - cannot load data');
        });
    };


    var p = new APIProvider($scope);

    p.config(function () {
      $scope.url = $scope.widget.url;
      if (angular.isDefined($scope.url)) $scope.load();
    })

      .provide('appendListener', function (evt) {
        if (angular.isDefined($scope.provider))
          apiUser.invoke(evt.emitterName, 'setDataProvider', $scope.provider);
      })

      .provide('getDataProvider', function (evt) {
        return $scope.provider;
      });
  }
);
