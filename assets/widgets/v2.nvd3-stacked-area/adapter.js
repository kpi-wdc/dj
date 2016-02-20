import angular from 'angular';


const m = angular.module('app.widgets.v2.stacked-area-chart-adapter', []);

m.service('StackedAreaAdapter', function () {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.x = (d) => d.x;
      options.chart.y = (d) => d.y;
      
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
      options.chart.color = (decoration.color) ? decoration.color : null;
      options.chart.interpolate = decoration.interpolation;
      options.chart.label = (decoration.showLabels) ? function (d) {
        return d.y.toFixed(2)
      } : undefined;
      options.chart.showPoints = 
        (angular.isDefined(decoration.showPoints)) ? decoration.showPoints : true;
      options.chart.stacked.label = (decoration.showLabels) ? function (d) {
        return d.y.toFixed(2)
      } : undefined; 

    }
      
    return options;
  }

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
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
      decoration.showLabels = angular.isDefined(options.chart.label);
      decoration.interpolation = options.chart.interpolate;
      decoration.showPoints = options.chart.showPoints;
      return decoration;
    }
  }
});