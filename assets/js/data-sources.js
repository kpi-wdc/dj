import angular from 'angular';
import 'info';

const dataSources = angular.module('datasource-uploader', ['app.info']);

dataSources.controller('DataSourcesController', function ($scope, $http, alert) {
  angular.extend($scope, {
    uploadFile(files) {
      const fd = new FormData();
      //Take the first selected file
      fd.append('file', files[0]);
      $http.post(`/api/data/dataSource`, fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      }).success(data => {
        alert.message(`Successful load. Received id: ${data}`);
      }).error((data, status) => {
        alert.error(`An error occurred. Error code: ${status}`);
      });
    }
  });
});

