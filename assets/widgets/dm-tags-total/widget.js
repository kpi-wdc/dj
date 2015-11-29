import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-tags-total', ['app.dictionary'])
  .controller('DataManagerTagsTotalController', function ($scope, $http, EventEmitter, APIProvider, $lookup) {
    
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.property = $scope.widget.property || $scope.property;
          $http.post(
            "./api/metadata/tag/total",
            {property : $scope.property}
           ).success(function(resp){
            $scope.count = resp.count;
          });
      })
      .provide('refresh', (evt) => {
        if ($scope.property && $scope.property!==""){
          $http.post(
            "./api/metadata/tag/total",
            {property : $scope.property}
           ).success(function(resp){
            $scope.count = resp.count;
          });
        }
      })
      
      .removal(() => {
        console.log('TagsTotal widget is destroyed');
      });
  });




