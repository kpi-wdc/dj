import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-pie/wizard';
import 'widgets/v2.nvd3-pie/adapter';


const m = angular.module('app.widgets.v2.nvd3-pie', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.pie-chart-wizard',
  'app.widgets.v2.pie-chart-adapter'
]);


m.controller('Nvd3PieChartCtrlV2', function ($scope, NVD3WidgetV2, PieChartWizard, PieChartAdapter) {
 
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: PieChartWizard,
          decorationAdapter: PieChartAdapter,
          optionsURL: "/widgets/v2.nvd3-pie/options.json",
          sampleURL: "/widgets/v2.nvd3-pie/sample.json",
           acceptData : function(context){
              return context.key == "pie"
          },
          serieAdapter: {
                getX: function (d) {
                  return d.label
                },
                getY: function (d) {
                  return (isNaN(d.value)) ? d.value : Number(Number(d.value).toFixed(2))
                },
                getSeries: function (series) {
                  return series
                },

                getSeriesSelection: function(data){
                  return data.map((s) => {return {key:s.label, disabled:false}})
                },

                getObjectsSelection: function(data){
                  return [];
                }
          }      
        });
});
