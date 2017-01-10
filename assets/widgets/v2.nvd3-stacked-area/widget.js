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
          sampleURL: "/widgets/v2.nvd3-stacked-area/sample.json",
          acceptData : function(context){
              return context.key == "area"
          },
          serieAdapter: {
            getSeriesSelection: function(data){
              return data.map((s) => {return {key:s.key, disabled:false}})
            },

            getObjectsSelection: function(data){
              let r = []
              data.forEach(function(s){
                s.values.forEach(function(v){
                  r.push({key:v.label, disabled:true})
                })
              })

              let result = [];
              r.forEach(function(item){
                  var notExists = true;
                  result.forEach(function(v){
                        notExists &= item.key != v.key;
                  })
                  if(notExists == true) result.push(item)
              });
              return result;
            }
          }
        }
  );
});
