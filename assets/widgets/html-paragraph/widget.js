import angular from 'angular';
import 'angular-foundation';


angular
  .module('app.widgets.html-paragraph', ['mm.foundation'])
  .controller('ParaController', 
    function ($scope, pageSubscriptions, APIProvider, i18n) {
  
      new APIProvider($scope)
        .config(() => {
          $scope.text = $scope.widget.text;
          $scope.img = $scope.widget.img;
          $scope.ref = $scope.widget.ref;
          $scope.withImage = angular.isDefined($scope.img) && angular.isDefined($scope.img.url) &&  $scope.img.url != "";
          $scope.withRef = angular.isDefined($scope.ref) &&  $scope.ref.url && $scope.ref.url != "";
          if($scope.withRef){
            $scope.ref.text = $scope.ref.text || decodeURIComponent($scope.ref.url)  
          }
        }) 
  })