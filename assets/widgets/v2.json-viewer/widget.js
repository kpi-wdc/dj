import angular from 'angular';
import 'ng-prettyjson';

let m = angular.module('app.widgets.v2.json-viewer', [
  'ngPrettyJson'])
  
  m.controller('JsonViewerController', function ($scope, APIProvider) {
    var data;
    new APIProvider($scope)
      .config(() => {$scope.data = data})

      .provide('setData', (e, context) => {
        if(!context){
          $scope.hidden = true;
          return
        }
        if(   context.key == "json" 
            ||context.key == "url" 
            // || context.key == "help" 
            // || context.key == "error"
        ){
          $scope.dataset = context.dataset;
          $scope.data = context.data;
          data = context.data;
          $scope.hidden = false;
        }else{
          if($scope.dataset!=context.dataset){
            $scope.hidden = true;
          }
        }
      })

      .removal(() => {});
  })



