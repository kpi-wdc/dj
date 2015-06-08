import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-radar/wizard';
import 'widgets/v2.nvd3-radar/adapter';


const m = angular.module('app.widgets.v2.nvd3-radar', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.radar-chart-wizard',
  'app.widgets.v2.radar-chart-adapter'
]);


m.controller('Nvd3RadarChartCtrlV2', function ($scope, NVD3WidgetV2, RadarChartWizard, RadarChartAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: RadarChartWizard,
          decorationAdapter: RadarChartAdapter,
          optionsURL: "/widgets/v2.nvd3-radar/options.json",
          serieAdapter: {
            //getX:function(d){return d.label},
            //getY:function(d){return d.value}
            tooltipContent: function (serie, x, y, s) {
              return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>"
            }
          }
        }
  );
});
