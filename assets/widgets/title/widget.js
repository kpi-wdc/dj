import angular from 'angular';

angular.module('app.widgets.title', [])
  .controller('TitleController', function ($scope, APIProvider) {
    new APIProvider($scope)
      .config(() => {
      	// console.log($scope.widget);
        $scope.title = $scope.widget.title;
        $scope.level = $scope.widget.level;
      });
  });
