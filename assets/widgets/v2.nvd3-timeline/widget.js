import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import 'widgets/v2.nvd3-timeline/wizard';
import 'widgets/v2.nvd3-timeline/adapter';


const m = angular.module('app.widgets.v2.nvd3-timeline', [
  'app.widgets.v2.nvd3-widget',
  'app.widgets.v2.timeline-chart-wizard',
  'app.widgets.v2.timeline-chart-adapter'
]);






m.controller('Nvd3TimelineChartCtrlV2', function (
  $scope, 
  NVD3WidgetV2,
  TimelineChartWizard,
  TimelineChartAdapter,
  i18n) {
 

  new NVD3WidgetV2(
      $scope, 
        {
          wizard: TimelineChartWizard,
          
          decorationAdapter: TimelineChartAdapter,
          
          optionsURL: "/widgets/v2.nvd3-timeline/options.json",
          
          translate: () => {
            $scope.data = $scope.params.serieAdapter.getSeries($scope.loadedData)
            $scope.options.chart.localeDef = i18n.localeDef();
            $scope.settings = {
                  options : angular.copy($scope.options), 
                  data : angular.copy($scope.data)
            }
          },

          dictionary: (data) => {
            return data.dictionary;
          },

          translations: (data) => {
            return data.dictionary.filter((item) => {return item.type =="i18n"})
          },

          serieAdapter: {
            
            getSeriesSelection: function(data){
              return []
            },

            getObjectsSelection: function(data){
               return []
            },

            getSeries : (data) => {
              
              var result = angular.copy(data.data.series);
              
              result.forEach(function(d,i){
                d.colorIndex = i;
                d.category = $scope.dictionary.lookup(d.category).label;
                d.category = $scope.translations.lookup(d.category)
              })
              
              return result;
          }
        }
      }  
  );
});
