import angular from 'angular';
import 'widgets/nvd3-widget/nvd3-widget';
import 'widgets/data-util/adapter';
import 'widgets/data-dialogs/dependency-chord-dialog';

const m = angular.module('app.widgets.nvd3-chord', [
  'app.widgets.nvd3-widget',
  'app.widgets.data-util.adapter',
  'app.widgets.data-dialogs.dependency-chord-dialog'

]);


m.service('NVD3ChordAdapter', function () {
  this.applyDecoration = function (options, decoration) {
    if (angular.isDefined(decoration) && angular.isDefined(options)) {
      options.chart.height = decoration.height;
      options.title.text = decoration.title;
      options.subtitle.text = decoration.subtitle;
      options.caption.text = decoration.caption;
      options.chart.isArea = decoration.isArea;
      options.chart.color = (decoration.color) ? decoration.color : null;
      options.chart.lines.label = (decoration.showLabels) ? function (d) {
        return d.value.toFixed(2)
      } : undefined;
      options.chart.lines.ticks = decoration.ticks;
      options.chart.lines.tickLabel = decoration.tickLabel;
      options.chart.lines.grid = decoration.grid;
      options.chart.lines.axisLabel = decoration.axisLabel;
    }
    return options;
  };
  this.getDecoration = function (options) {
    if (angular.isDefined(options)) {
      var decoration = {};
      decoration.height = options.chart.height;
      decoration.title = options.title.text;
      decoration.subtitle = options.subtitle.text;
      decoration.caption = options.caption.text;
      decoration.isArea = options.chart.isArea;
      decoration.color = options.chart.color;
      decoration.showLabels = angular.isDefined(options.chart.lines.label);

      decoration.ticks = options.chart.lines.ticks;
      decoration.tickLabel = options.chart.lines.tickLabel;
      decoration.grid = options.chart.lines.grid;
      decoration.axisLabel = options.chart.lines.axisLabel;

      return decoration;
    }
  }
});
//console.log("Nvd3ChordChartCtrl");
m.controller('Nvd3ChordChartCtrl',
  function ($scope, DependencyChordDialog, NVD3ChordAdapter, NVD3Widget, CorrelationMatrixGenerator) {

    new NVD3Widget($scope, {
      dialog: DependencyChordDialog,
      decorationAdapter: NVD3ChordAdapter,
      optionsURL: "/widgets/nvd3-chord/options.json",
      serieAdapter: {
        //getX:function(d){return d.label},
        //getY:function(d){return d.value}
        tooltipContent: function (serie, x, y, s) {

          return "<center><b>" + s.point.label + "</b><br/>" + s.series.key + " : " + s.point.value.toFixed(2) + "</center>"
        }
      },
      serieGenerator: CorrelationMatrixGenerator
    })
  });
//console.log("Loaded")
