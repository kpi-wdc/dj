import angular from 'angular';


let m = angular.module('app.widgets.v2.offcanvas', ["oc.lazyLoad"]);


m.controller('OffCnsController', function (
        $scope,
        $ocLazyLoad, 
        app,
        config,
        author){

  // $ocLazyLoad.load({
  //     files: [
  //       "/css/topbar.css"
  //     ]
  //   });

  $scope.config = config;
    
});


  