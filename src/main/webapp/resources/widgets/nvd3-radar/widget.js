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
                    "height": 450,
                    "isArea": true,
                    "lines" :{
                        "label": function(d,i){return d.value},
                        "grid":true,
                        "axisLabel":true,
                        "tickLabel":true,
                        "ticks":15
                    },
                    color:['#aa0000','#00aa00','#0000aa']
                }
            }

            $scope.series = [{
                key:"First Serie",
                values:[
                    {label:"Label 1", value:20},
                    {label:"L2", value:20},
                    {label:"L3", value:10},
                    {label:"L4", value:20},
                    {label:"Label 5", value:10},
                    {label:"L6", value:20},
                    {label:"L7", value:15}
                ]
            },
                {
                    key:"Serie 1",
                    values:[
                        {label:"Label 1", value:5},
                        {label:"L2", value:8},
                        {label:"L3", value:1},
                        {label:"L4", value:15},
                        {label:"Label 5", value:7},
                        {label:"L6", value:10},
                        {label:"L7", value:4}
                    ]
                },{
                key:"Serie 2",
                values:[
                    {label:"Label 1", value:2},
                    {label:"L2", value:3},
                    {label:"L3", value:4},
                    {label:"L4", value:5},
                    {label:"Label 5", value:6},
                    {label:"L6", value:7},
                    {label:"L7", value:8}
                ]
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
