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
          sampleURL: "/widgets/v2.nvd3-bar-h/sample.json",
          
          acceptData : function(context){
              return context.key == "hbar"
          },
          serieAdapter: {
            getX: function (d) {
              return d.label
            },
            getY: function (d) {
              return d.value
            },
            
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
        });
});
