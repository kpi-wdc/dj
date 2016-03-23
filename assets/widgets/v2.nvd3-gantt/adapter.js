import angular from 'angular';


const m = angular.module('app.widgets.v2.gantt-chart-adapter', []);

m.service('GanttChartAdapter', function () {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      options.chart.width = decoration.width;
      
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      // options.chart.isArea = decoration.isArea;
      // options.chart.color = (decoration.color) ? decoration.color : null;
      // options.chart.lines.label = (decoration.showLabels) ? function (d) {
      //   return d.value.toFixed(2)
      // } : undefined;
      // options.chart.lines.ticks = decoration.ticks;
      // options.chart.lines.tickLabel = decoration.tickLabel;
      // options.chart.lines.grid = decoration.grid;
      // options.chart.lines.axisLabel = decoration.axisLabel;
    }
    return options;
  };
  this.getDecoration = function (options) {
    console.log("options",options)
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;
      decoration.width = options.chart.width;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      // decoration.isArea = options.chart.isArea;
      // decoration.color = options.chart.color;
      // decoration.showLabels = angular.isDefined(options.chart.lines.label);

      // decoration.ticks = options.chart.lines.ticks;
      // decoration.tickLabel = options.chart.lines.tickLabel;
      // decoration.grid = options.chart.lines.grid;
      // decoration.axisLabel = options.chart.lines.axisLabel;

      return decoration;
    }
  };  
});