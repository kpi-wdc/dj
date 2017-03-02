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
 
  console.log("CREATE CONTROLLER")
  new NVD3WidgetV2(
      $scope, 
        {
          wizard: TimelineChartWizard,
          
          decorationAdapter: TimelineChartAdapter,
          
          optionsURL: "/widgets/v2.nvd3-timeline/options.json",
          sampleURL: "/widgets/v2.nvd3-timeline/sample.json",
          
          acceptData : function(context){
            if(!context || !context.data) return false;
              return (context.key == "timeline") || (context.data.tag == "timeline")
           },

          translate: () => {
            $scope.data = $scope.params.serieAdapter.getSeries($scope.loadedData)
            $scope.options.chart.localeDef = i18n.localeDef();
            $scope.settings = {
                  options : angular.copy($scope.expandOptions($scope.options)), 
                  data : angular.copy($scope.data)
            }
          },

          onBeforeDesignMode: () => {
            if($scope.api && $scope.api.chart())
                $scope.api.chart().destroy();
          },

          onBeforePresentationMode: () => {
           if($scope.api && $scope.api.chart())
                $scope.api.chart().destroy();
          },

          onBeforeConfig: () => {
           if($scope.api && $scope.api.chart())
                $scope.api.chart().destroy();
          },

          onRemove: () => {
            $scope.api.chart().destroy();
          },
          
          onBeforeChangePage: () => {
            if($scope.api && $scope.api.chart())
                $scope.api.chart().destroy();
          },


          dictionary: (data) => {
            if(!data) return []
            
            if(!data.dictionary){
              data = data.value;
            }
            
            if(!data) return [];
            
            if(!data.dictionary) return [];
              
            return data.dictionary;
          },

          translations: (data) => {
            console.log("TRANSLATIONS", data)
            if(!data) return []
            
            if(!data.dictionary){
              data = data.value;
            }

            if(!data) return [];
            
            if(!data.dictionary) return [];
            
            return  data.dictionary.filter((item) => {return item.type =="i18n"})
          },


          serieAdapter: {
            
            getSeriesSelection: function(data){
              return []
            },

            getObjectsSelection: function(data){
               return []
            },

            getSeries : (data) => {
              if(!data) return []
              if(!data.dictionary){
                data = data.value;
              }
              
              if(!data) return [];
              if(!data.data) return [];
              if(!data.data.series) return [];
              
              
              var result = angular.copy(data.data.series);
              
              result.forEach(function(d,i){
                d.colorIndex = i;
                d.category = $scope.dictionary.lookup(d.category).label;
                d.category = $scope.translations.translate(d.category)
              })
              
              return result;
          }
        }
      }  
  );
});
