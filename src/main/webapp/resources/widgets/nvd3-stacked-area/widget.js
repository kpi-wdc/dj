define([
        'angular',
        '/widgets/nvd3-widget/nvd3-widget.js',
        '/widgets/data-dialogs/line-chart-dialog.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.nvd3-stacked-area',[
            'app.widgets.nvd3-widget',
            'app.widgets.data-dialogs.line-chart-dialog'
        ]);


        m.service('NVD3StackedAreaAdapter', function () {
            this.applyDecoration = function (options, decoration) {
                if(angular.isDefined(decoration)&&angular.isDefined(options)) {
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
                }
                return options;
            }
            this.getDecoration = function (options){
                if(angular.isDefined(options)) {
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
                    return decoration;
                }
            }
        });

        m.controller('Nvd3StackedAreaChartCtrl',function($scope,LineChartDialog,NVD3StackedAreaAdapter,NVD3Widget){
            new NVD3Widget($scope,{
                dialog: LineChartDialog,
                decorationAdapter: NVD3StackedAreaAdapter,
                optionsURL: "/widgets/nvd3-stacked-area/options.json",
                serieAdapter:{
                    getX:function(d){return d.x},
                    getY:function(d){return d.y}
                }
            })
        });

    });
