import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-chord/wizard';
import 'widgets/v2.nvd3-chord/adapter'

const m = angular.module('app.widgets.v2.nvd3-chord', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.chord-chart-wizard',
  "app.widgets.v2.chord-chart-adapter"
]);


m.controller('Nvd3ChordChartCtrlV2', function ($scope, NVD3WidgetV2, ChordChartWizard, NVD3ChordAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: ChordChartWizard,
          decorationAdapter: NVD3ChordAdapter,
          optionsURL: "/widgets/v2.nvd3-chord/options.json",
          sampleURL: "/widgets/v2.nvd3-chord/sample.json",
          acceptData : function(context){
              return context.key == "deps"
          },
          serieAdapter: {
            getSeriesSelection: function(data){
              return []
            },

            getObjectsSelection: function(data){
               return []
            },
            
            tooltipContent: function (serie, x, y, s) {
              return  "<center><b>" 
                      + s.point.label 
                      + "</b><br/>" 
                      + s.series.key 
                      + " : " 
                      + s.point.value.toFixed(2) 
                      + "</center>"
              }
          }
        }
  );
});
