import angular from 'angular';

angular.module('app.widgets.html-article', [])
  .controller('ArticleController', function ($scope, APIProvider) {
    new APIProvider($scope)
      .config(() => {

      	$scope.widget.href.description = ($scope.widget.href.description)
      		? $scope.widget.href.description
      		: decodeURIComponent($scope.widget.href.url)
      });
     
  });
