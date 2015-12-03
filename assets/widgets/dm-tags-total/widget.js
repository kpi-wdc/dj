import angular from 'angular';
import 'dictionary';


angular.module('app.widgets.dm-tags-total', ['app.dictionary'])
  .controller('DataManagerTagsTotalController', function ($scope, $http, EventEmitter, 
    APIProvider, $lookup, user) {
    
    new APIProvider($scope)
      .config( () => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.title = $scope.widget.title;
        $scope.tags = $scope.widget.tags || [];
        $scope.icon_class = $scope.widget.icon_class;
        var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
        $scope.tags.forEach(function(item){
          $http.post(
            "./api/metadata/tag/total",
            {property : item.path, "status" :status}
           ).success(function(resp){
            item.count = resp.count;
          });
        })  
          
      })
      .provide('refresh', (evt) => {
        var status = (user.isOwner || user.isCollaborator) ? "private" : "public";
        $scope.tags.forEach(function(item){
          $http.post(
            "./api/metadata/tag/total",
             {property : item.path, "status" :status}
           ).success(function(resp){
            item.count = resp.count;
          });
        })  
      })
      
      .removal(() => {
        console.log('TagsTotal widget is destroyed');
      });
  });




