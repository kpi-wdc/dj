import angular from 'angular';

const dataSources = angular.module('dataSources', []);

dataSources.controller('DataSourcesController', function ($scope, $http) {
  $scope.uploadFile = function(files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append('file', files[0]);
    $http.post(`/api/data/dataSource`, fd, {
      withCredentials: true,
      headers: {'Content-Type': undefined},
      transformRequest: angular.identity
    });
  };
});

angular.bootstrap(document, ['dataSources']);
