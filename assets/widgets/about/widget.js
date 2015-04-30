import angular from 'angular';

angular.module('app.widgets.about', [])
  .controller('AboutAuthorsController', function ($scope, APIProvider, author) {
    new APIProvider($scope)
      .config(() => {
        $scope.author = author;
      });
  });
