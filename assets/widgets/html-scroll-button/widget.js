import angular from 'angular';

angular.module('app.widgets.html-scroll-button', [])
  .controller('ScrollButtonController', function ($scope, APIProvider, $scroll) {
  	$scope.scroll = $scroll;
    new APIProvider($scope)
      .config(() => {
      	$scope.targets = $scope.widget.targets || [];
      });
  });
