"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var angular = _interopRequire(require("angular"));

require("widgets/data-util/json-stat-data-provider");

require("widgets/data-dialogs/datasource-dialog");

require("widgets/data-util/adapter");

var m = angular.module("app.widgets.datasource", ["app.widgetApi", "app.widgets.data-util.json-stat-data-provider", "app.widgets.data-dialogs.datasource-dialog"]);

m.controller("DataSourceController", ["$scope", "$http", "$window", "APIUser", "EventEmitter", "APIProvider", "JSONstatDataProvider", "DatasourceDialog", function ($scope, $http, $window, APIUser, EventEmitter, APIProvider, JSONstatDataProvider, DatasourceDialog) {

  var eventEmitter = new EventEmitter($scope);
  var apiUser = new APIUser($scope);
  $scope.url = $scope.widget.url;
  $scope.APIProvider = new APIProvider($scope);
  $scope.APIUser = new APIUser($scope);

  $scope.load = function () {

    $http.get($scope.url).success(function (data) {

      data = $scope.url.indexOf("/api/data/process/") > 0 ? data.value : data;
      $scope.data = data;
      if (JSONstatDataProvider.isCompatible(data)) {
        $scope.provider = new JSONstatDataProvider($scope.data, $scope.url);
        $scope.info = $scope.provider.getDatasets();
        eventEmitter.emit("loadDataSuccess", $scope.provider);
      } else {
        alert("Not supported data format");
      }
    }).error(function (data, status) {
      $window.alert("$http error " + status + " - cannot load data");
    });
  };

  var p = new APIProvider($scope);

  p.config(function () {
    $scope.url = $scope.widget.url;
    if (angular.isDefined($scope.url)) $scope.load();
  }).openCustomSettings(function () {
    $scope.dialog = new DatasourceDialog($scope);
    $scope.dialog.open();
  }).provide("appendListener", function (evt) {
    if (angular.isDefined($scope.provider)) apiUser.invoke(evt.emitterName, "setDataProvider", $scope.provider);
  }).provide("getDataProvider", function (evt) {
    return $scope.provider;
  });
}]);
