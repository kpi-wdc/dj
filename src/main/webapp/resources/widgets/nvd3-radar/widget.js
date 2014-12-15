define([
        'angular',
        '/widgets/nvd3-widget/nvd3-widget.js',
        '/widgets/data-dialogs/bar-chart-dialog.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.nvd3-radar',[
            'app.widgets.nvd3-widget',
            'app.widgets.data-dialogs.bar-chart-dialog'

            ]);


        m.service('NVD3RadarAdapter', function () {
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

        m.controller('Nvd3RadarChartCtrl',function($scope) {
            $scope.options = {
                "chart": {
                    "type": "radarChart",
                    "height": 450
                }}
            $scope.series = [{
                key:"First Serie",
                values:[{label:"L1", value:20},{label:"L2", value:20},{label:"L3", value:20}]
            },{
                key:"Serie",
                values:[{label:"L1", value:2},{label:"L2", value:50},{label:"L3", value:10}]
            }]


        });




            //,BarChartDialog,NVD3RadarAdapter,NVD3Widget){
            //new NVD3Widget($scope,{
            //        dialog: BarChartDialog,
            //        decorationAdapter: NVD3BarAdapter,
            //        optionsURL: "/widgets/nvd3-radar/options.json",
            //        serieAdapter:{
            //            getX:function(d){return d.label},
            //            getY:function(d){return d.value}
            //        }
            //    })
            //});
    });
