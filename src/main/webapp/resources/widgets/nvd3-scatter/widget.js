define([
        'angular',
        '/widgets/nvd3-widget/nvd3-widget.js',
        '/widgets/data-util/adapter.js',
        '/widgets/data-dialogs/line-chart-dialog.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.nvd3-scatter',
            ['app.widgets.nvd3-widget',
                'app.widgets.data-util.adapter',
             'app.widgets.data-dialogs.line-chart-dialog'
            ]);


        m.service('NVD3ScatterAdapter', function () {

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
                    options.chart.color = (decoration.color) ? decoration.color : null;
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
                    decoration.color = options.chart.color;
                    return decoration;
                }
            }
        });

        m.controller('Nvd3ScatterChartCtrl',function($scope,LineChartDialog,NVD3ScatterAdapter,NVD3Widget,  ScatterSerieGenerator){
            new NVD3Widget($scope,{
                dialog: LineChartDialog,
                decorationAdapter: NVD3ScatterAdapter,
                optionsURL: "/widgets/nvd3-scatter/options.json",
                serieAdapter:{
                    getX:function(d){return d.x},
                    getY:function(d){return d.y},
                    tooltipContent: function(serie,x,y,s){
                        //console.log(serie,x,y,s)
                        return "<b>"+s.point.label + "</b>"
                    },
                    tooltipXContent: function(serie,x,y,s){
                        //console.log("X",serie,x,y,s)
                        return "<b>"+s.series.base.title+": </b>"+x
                    },
                    tooltipYContent: function(serie,x,y,s){
                        //console.log("X",serie,x,y,s)
                        return "<b>"+serie+": </b>"+y
                    }
                },
                serieGenerator: ScatterSerieGenerator
            })
        });

    });
