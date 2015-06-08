import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-line/wizard';
import 'widgets/v2.nvd3-line/adapter';


const m = angular.module('app.widgets.v2.nvd3-line', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.line-chart-wizard',
  'app.widgets.v2.line-chart-adapter'
]);


m.controller('Nvd3LineChartCtrlV2', function ($scope, NVD3WidgetV2, LineChartWizard, LineChartAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: LineChartWizard,
          decorationAdapter: LineChartAdapter,
          optionsURL: "/widgets/v2.nvd3-line/options.json",
          serieAdapter: {
            getX: function (d) {
              return d.x
            },
            getY: function (d) {
              return d.y
            }
          }
        }
  );
});
