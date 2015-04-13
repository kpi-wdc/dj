import angular from 'angular';

const dataSources = angular.module('dataSources', []);

dataSources.controller('DataSourcesController', function ($scope, $http, $window) {
  var okMessage = function(dataId) {
    $window.alert("Successful load. Received id: " + dataId)
  };

  var errMessage = function(status) {
    $window.alert("An error occurred. Error code: " + status)
  };

  $scope.uploadFile = function(files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append('file', files[0]);
    $http.post(`/api/data/dataSource`, fd, {
      withCredentials: true,
      headers: {'Content-Type': undefined},
      transformRequest: angular.identity
    }).success(function(data, status, headers, config) {
      okMessage(data);
    }).error(function(data, status, headers, config) {
      errMessage(status);
      console.log(data)
    });
  };
});

angular.bootstrap(document, ['dataSources']);
