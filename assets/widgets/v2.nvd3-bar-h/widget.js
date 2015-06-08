import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-bar-h/wizard';
import 'widgets/v2.nvd3-bar-h/adapter';


const m = angular.module('app.widgets.v2.nvd3-bar-h', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.hbar-chart-wizard',
  'app.widgets.v2.hbar-chart-adapter'
]);


m.controller('Nvd3HBarChartCtrlV2', function ($scope, NVD3WidgetV2, HBarChartWizard, HBarChartAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: HBarChartWizard,
          decorationAdapter: HBarChartAdapter,
          optionsURL: "/widgets/v2.nvd3-bar-h/options.json",
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
