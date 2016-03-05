import angular from 'angular';



const m = angular.module("app.widgets.v2.geochart-adapter",[]);


m.service("GeochartAdapter", [

  "i18n",

  function (i18n) {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      // options.chart.width = decoration.width;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.color = decoration.color ? decoration.color : null;

      options.chart.showLabels = decoration.showLabels;
      options.chart.showValues = decoration.showValues;
      options.chart.showTiles = decoration.showTiles;
      options.chart.selectedTiles = decoration.selectedTiles;
      options.chart.interactive = decoration.interactive;
      options.chart.defaultFill = decoration.defaultFill;
      options.chart.defaultFillOpacity = decoration.defaultFillOpacity;
      options.chart.defaultStroke = decoration.defaultStroke;
      options.chart.defaultStrokeWidth = decoration.defaultStrokeWidth;
      options.chart.defaultStrokeOpacity = decoration.defaultStrokeOpacity;
      options.chart.selectedFillOpacity = decoration.selectedFillOpacity;
      options.chart.selectedStrokeWidth = decoration.selectedStrokeWidth;
      options.chart.boundary = decoration.boundary;
      
      options.chart.locale = i18n.locale();
           
    }
    return options;
  };

  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;

      // decoration.width = options.chart.width;

      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.color = options.chart.color;

      decoration.showLabels = options.chart.showLabels;
      decoration.showValues = options.chart.showValues;
      decoration.showTiles = options.chart.showTiles;
      decoration.selectedTiles = options.chart.selectedTiles;
      decoration.interactive = options.chart.interactive;
      decoration.defaultFill = options.chart.defaultFill;
      decoration.defaultFillOpacity = options.chart.defaultFillOpacity;
      decoration.defaultStroke = options.chart.defaultStroke;
      decoration.defaultStrokeWidth = options.chart.defaultStrokeWidth;
      decoration.defaultStrokeOpacity = options.chart.defaultStrokeOpacity;
      decoration.selectedFillOpacity = options.chart.selectedFillOpacity;
      decoration.selectedStrokeWidth = options.chart.selectedStrokeWidth;
      decoration.boundary = options.chart.boundary;
      return decoration;
    }
  };
}]);

