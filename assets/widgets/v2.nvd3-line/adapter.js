import angular from 'angular';


const m = angular.module('app.widgets.v2.line-chart-adapter', []);

m.service('LineChartAdapter', function () {

    this.onSelectSerie = (selection,settings,api) => {
      let data = d3.select(api.getSVG()).data();
      settings.data.forEach((s) => {
        let f = selection.filter(l => l.key == s.key)[0]
        if(f){
          s.disabled =  f.disabled
        }
      })
      return settings;
    } 

   this.applyDecoration = function (options, decoration, selector,api) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.xAxis.axisLabel = decoration.xAxisName;
      options.chart.yAxis.axisLabel = decoration.yAxisName;
      options.chart.xAxis.staggerLabels = decoration.staggerLabels;
      options.chart.rotateLabels = decoration.xAxisAngle;
      options.chart.reduceXTicks = decoration.reduceXTicks;
      options.chart.isArea = decoration.isArea;
      // console.log("apply showPoints for "+options.chart.lines.scatter)
      options.chart.showPoints = 
        (angular.isDefined(decoration.showPoints)) ? decoration.showPoints : true;

      options.chart.interpolate = decoration.interpolation;

      options.chart.color = (decoration.color) ? decoration.color : null;

      options.chart.lines.label = (decoration.showLabels) ? function (d) {
        return d.label// return d.y.toFixed(2)
      } : undefined;

      if(decoration.enableEmitEvents){
        options.chart.legend.dispatch = {
          stateChange: function(e) {
            selector.selectSerie(e.disabled);
          }
        }
      }


    }
    return options;
  }

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      console.log(options);
      var decoration = {}
      decoration.height = options.chart.height;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.xAxisName = options.chart.xAxis.axisLabel;
      decoration.yAxisName = options.chart.yAxis.axisLabel;
      decoration.xAxisAngle = options.chart.rotateLabels;
      decoration.reduceXTicks = options.chart.reduceXTicks;
      decoration.staggerLabels = options.chart.xAxis.staggerLabels;
      decoration.isArea = options.chart.isArea;
      decoration.color = options.chart.color;
      decoration.interpolation = options.chart.interpolate;
      decoration.showPoints = options.chart.showPoints;


      decoration.showLabels = angular.isDefined(options.chart.lines.label);
      return decoration;
    }
  };
});