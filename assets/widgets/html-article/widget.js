import angular from 'angular';

angular.module('app.widgets.html-article', [])
  .controller('ArticleController', function ($scope, APIProvider) {
    new APIProvider($scope)
      .config(() => {
      	if($scope.widget.href){
      		$scope.widget.href = ($scope.widget.href.url)?$scope.widget.href : undefined;
      	}
      	if($scope.widget.href){
	      	$scope.widget.href.description = ($scope.widget.href.description)
	      		? $scope.widget.href.description
	      		: decodeURIComponent($scope.widget.href.url)
      	}	
      });
     
  });
