import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import 'widgets/data-util/adapter';
import 'widgets/data-dialogs/map-chart-dialog';

const m = angular.module("app.widgets.nvd3-map",
  ["app.widgets.nvd3-widget", "app.widgets.data-util.adapter", "app.widgets.data-dialogs.map-chart-dialog"]);


m.service("NVD3MapAdapter", function () {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
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

    }
    return options;
  };

  this.getDecoration = function (options) {
    // console.log(options)
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;
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


      return decoration;
    }
  };
});
//console.log("Nvd3ChordChartCtrl");
m.controller("Nvd3MapCtrl", ["$scope", "MapChartDialog", "NVD3MapAdapter", "NVD3Widget", "MapSerieGenerator",
  function ($scope, MapChartDialog, NVD3MapAdapter, NVD3Widget, MapSerieGenerator) {
    new NVD3Widget($scope, {
      dialog: MapChartDialog,
      decorationAdapter: NVD3MapAdapter,
      optionsURL: "/widgets/nvd3-map/options.json",
      serieAdapter: {
        //getX:function(d){return d.label},
        //getY:function(d){return d.value}
        tooltipContent: function (serie, x, y, s) {
          var result = "<center><b>" + serie.properties.name + "</center></b>";
          if (serie.properties.value != null) {
            result += "<div style=\"font-size:smaller;padding: 0 0.5em;\"> " + serie.properties.key + " : " + serie.properties.value + "</div>";
          }
          return result;
        }
      },
      // serieGenerator: MapSerieGenerator
    });
  }]);
//console.log("Loaded")
