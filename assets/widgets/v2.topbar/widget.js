import angular from 'angular';


let m = angular.module('app.widgets.v2.topbar', ["oc.lazyLoad"]);


m.controller('TopBarController', function (
        $scope,
        $ocLazyLoad, 
        app,
        config,
        author){

  $ocLazyLoad.load({
      files: [
        "/css/topbar.css"
      ]
    });

  $scope.config = config;
    
});


  