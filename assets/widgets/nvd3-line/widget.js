define([
    'angular',
    'widgets/nvd3-widget/nvd3-widget.js',
    'widgets/data-util/adapter.js',
    'widgets/data-dialogs/line-chart-dialog.js'
  ],
  function (angular) {

    var m = angular.module('app.widgets.nvd3-line',
      ['app.widgets.nvd3-widget',
        'app.widgets.data-util.adapter',
        'app.widgets.data-dialogs.line-chart-dialog'
      ]);


    m.service('NVD3LineAdapter', function () {

      this.applyDecoration = function (options, decoration) {
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

          options.chart.interpolate = decoration.interpolation;

          options.chart.color = (decoration.color) ? decoration.color : null;

          options.chart.lines.label = (decoration.showLabels) ? function (d) {
            return d.y.toFixed(2)
          } : undefined;


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


          decoration.showLabels = angular.isDefined(options.chart.lines.label);
          return decoration;
        }
      }
    });


    m.controller('Nvd3LineChartCtrl', function ($scope, LineChartDialog, NVD3LineAdapter, NVD3Widget, ScatterSerieGenerator) {

      new NVD3Widget($scope, {
        dialog: LineChartDialog,
        decorationAdapter: NVD3LineAdapter,
        optionsURL: "/widgets/nvd3-line/options.json",
        serieAdapter: {
          getX: function (d) {
            return d.x
          },
          getY: function (d) {
            return d.y
          }
        },
        serieGenerator: ScatterSerieGenerator
      })
    });

  });
