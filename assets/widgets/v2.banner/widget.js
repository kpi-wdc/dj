import angular from 'angular';

angular.module('app.widgets.v2.banner', [])
  .controller('BannerController', function ($scope, APIProvider, parentHolder) {
    new APIProvider($scope)
      .config(() => {
        $scope.bgImage = $scope.widget.bgImage || "./img/default-banner.png";
        $scope.enabled = $scope.widget.enabled;
      });
  });
