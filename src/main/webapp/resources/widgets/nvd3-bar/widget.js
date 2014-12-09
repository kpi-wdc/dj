define([
        'angular',
        '/widgets/nvd3-widget/nvd3-widget.js',
        '/widgets/data-dialogs/bar-chart-dialog.js',
        '/widgets/nvd3-bar/nvd3-bar-adapter.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.nvd3-bar',[
            'app.widgets.nvd3-widget',
            'app.widgets.data-dialogs.bar-chart-dialog',
            'app.widgets.nvd3.nvd3-bar-adapter'
            ]);


        m.service('NVD3BarAdapter', function () {
            this.applyDecoration = function (options, decoration) {
                if(angular.isDefined(decoration)&&angular.isDefined(options)) {
                    console.log(options)
                    options.chart.height = decoration.height;
                    options.title.text = decoration.title;
                    options.subtitle.text = decoration.subtitle;
                    options.caption.text = decoration.caption;
                    options.chart.xAxis.axisLabel = decoration.xAxisName;
                    options.chart.yAxis.axisLabel = decoration.yAxisName;
                    options.chart.xAxis.staggerLabels = decoration.staggerLabels;
                    options.chart.rotateLabels = decoration.xAxisAngle;
                    options.chart.reduceXTicks = decoration.reduceXTicks;
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
                    return decoration;
                }
            }
        })

        m.controller('Nvd3BarChartCtrl',function($scope,BarChartDialog,NVD3BarAdapter,NVD3Widget){
            new NVD3Widget($scope,{
                    dialog: BarChartDialog,
                    decorationAdapter: NVD3BarAdapter,
                    optionsURL: "/widgets/nvd3-bar/options.json",
                    serieAdapter:{
                        getX:function(d){return d.label},
                        getY:function(d){return d.value}
                    }
                })
            });
    });
