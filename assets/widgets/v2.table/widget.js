import angular from 'angular';
import "custom-react-directives";
import "angular-oclazyload";
import 'widgets/v2.table/wizard';

const m = angular.module('app.widgets.v2.table', [
  "oc.lazyLoad",
  "custom-react-directives",
  'app.widgets.v2.table-wizard'
]);


m.controller('TableCtrl', function ($scope, $http, $ocLazyLoad, APIProvider, TableWizard) {
  
  $ocLazyLoad.load({
      files: [
        "/widgets/v2.table/data-widget.css"
      ]
    });

  $scope.update = function(){
     $scope.pending = angular.isDefined($scope.widget.dataID);
        if($scope.pending){
          $http.get("./api/data/process/"+$scope.widget.dataID)
            .success((resp) => {
              $scope.pending = false;
              $scope.table = resp.value;
              $scope.decoration = $scope.widget.decoration;
              $scope.settings = {table:angular.copy($scope.table), decoration:angular.copy($scope.decoration)}
          })
        }  
  }

  new APIProvider($scope)
    .config(() => {
        console.log($scope.widget)
        $scope.update();
    },true)
    .openCustomSettings(function () {
        $scope.wizard = TableWizard;
        $scope.wizard.start($scope);
    })
});
