import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-distribution/wizard';
import 'widgets/v2.nvd3-distribution/adapter';


const m = angular.module('app.widgets.v2.nvd3-distribution', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.distribution-chart-wizard',
  'app.widgets.v2.distribution-chart-adapter'
]);


m.controller('Nvd3DistributionChartCtrlV2', function ($scope, NVD3WidgetV2, DistributionChartWizard, DistributionAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: DistributionChartWizard,
          decorationAdapter: DistributionAdapter,
          optionsURL: "/widgets/v2.nvd3-distribution/options.json",
          serieAdapter: {
            getX: function (d) {
              return d.x
            },
            getY: function (d) {
              return d.y
            },
            getLabel: function(d){
              return /*"["+d.label+"] - "+*/ d.y
            },
            
            label: function(d){
              return d.label
            }
          }
        }
  );
});
