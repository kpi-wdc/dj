import angular from 'angular';

angular.module('app.widgets.htmlwidget', [])
  .controller('HtmlWidgetController', function ($scope, $sce, APIProvider) {
    new APIProvider($scope)
      .config(() => {
        $scope.text = $sce.trustAsHtml($scope.widget.text);
      });
  });
