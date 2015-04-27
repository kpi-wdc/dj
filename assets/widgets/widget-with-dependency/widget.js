import angular from 'angular';
import 'widgets/non-visual-widget/widget';

angular.module('app.widgets.widget-with-dependency', ['app.widgets.non-visual-widget'])
  .controller('WidgetWithDependencyCtrl', function ($scope, NonVisualWidgetData) {
    $scope.text = NonVisualWidgetData;
  });
