import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-bar/wizard';
import 'widgets/v2.nvd3-bar/adapter';


const m = angular.module('app.widgets.v2.nvd3-bar', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.bar-chart-wizard',
  'app.widgets.v2.bar-chart-adapter'
]);


m.controller('Nvd3BarChartCtrlV2', function ($scope, NVD3WidgetV2, BarChartWizard, BarChartAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: BarChartWizard,
          decorationAdapter: BarChartAdapter,
          optionsURL: "/widgets/v2.nvd3-bar/options.json",
          serieAdapter: {
            getX: function (d) {
              return d.label
            },
            getY: function (d) {
              return d.value
            }
          }
        });
});
