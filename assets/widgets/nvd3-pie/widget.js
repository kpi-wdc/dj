define([
    'angular',
    'widgets/nvd3-widget/nvd3-widget.js',
    'widgets/data-util/adapter.js',
    'widgets/data-dialogs/pie-chart-dialog.js'
  ],
  function (angular) {

    var m = angular.module('app.widgets.nvd3-pie', [
      'app.widgets.nvd3-widget',
      'app.widgets.data-util.adapter',
      'app.widgets.data-dialogs.pie-chart-dialog'
    ]);

    m.service('NVD3PieAdapter', function () {
      this.applyDecoration = function (options, decoration) {
        if (angular.isDefined(decoration) && angular.isDefined(options)) {
          options.chart.height = decoration.height;
          options.title.text = decoration.title;
          options.subtitle.text = decoration.subtitle;
          options.caption.text = decoration.caption;
          options.chart.donut = decoration.donut;
          options.chart.donutRatio = decoration.donutRatio;
          options.chart.donutLabelsOutside = decoration.labelsOutside;
          options.chart.pieLabelsOutside = decoration.labelsOutside;
          options.chart.labelType = (decoration.valueAsLabel) ? "value" : "key";
          options.chart.color = (decoration.color) ? decoration.color : null;
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
          decoration.donut = options.chart.donut;
          decoration.donutRatio = options.chart.donutRatio;
          decoration.labelsOutside = options.chart.donutLabelsOutside || options.chart.pieLabelsOutside;
          decoration.valueAsLabel = (options.chart.labelType == "value");
          decoration.color = options.chart.color;
          return decoration;
        }
      }
    })


    m.controller('Nvd3PieChartCtrl', function ($scope, PieChartDialog, NVD3PieAdapter, NVD3Widget, BarSerieGenerator) {
      new NVD3Widget($scope, {
        dialog: PieChartDialog,
        decorationAdapter: NVD3PieAdapter,
        optionsURL: "/widgets/nvd3-pie/options.json",
        serieAdapter: {
          getX: function (d) {
            return d.label
          },
          getY: function (d) {
            return (isNaN(d.value)) ? d.value : Number(Number(d.value).toFixed(2))
          },
          getSeries: function (series) {
            return series[0].values
          }
        },
        serieGenerator: BarSerieGenerator
      })
    });

  });
