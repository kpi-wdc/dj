import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-stacked-area/wizard';
import 'widgets/v2.nvd3-stacked-area/adapter';


const m = angular.module('app.widgets.v2.nvd3-stacked-area', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.stacked-area-chart-wizard',
  'app.widgets.v2.stacked-area-chart-adapter'

]);


m.controller('Nvd3StackedAreaChartCtrlV2', function ($scope, NVD3WidgetV2, StackedAreaChartWizard, StackedAreaAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: StackedAreaChartWizard,
          decorationAdapter: StackedAreaAdapter,
          optionsURL: "/widgets/v2.nvd3-stacked-area/options.json",
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
