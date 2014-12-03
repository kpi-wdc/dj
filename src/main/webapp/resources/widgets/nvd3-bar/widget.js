require.config({
    paths: {
        'd3': '/components/d3/d3',
        'nv.d3': '/components/nvd3/nv.d3',
        'angular-nvd3': '/components/angular-nvd3/dist/angular-nvd3'
    }
    ,
    shim: {
           'd3':{
               exports: 'd3'
           },
           'nv.d3':{
                exports: 'nv',
                deps: ['d3']
            },
            'angular-nvd3':{
                deps: ['nv.d3']
            }
    }
});



define([
        'angular',
        'angular-nvd3',
        '/widgets/data-dialogs/bar-chart-dialog.js',
        '/widgets/data-util/adapter.js'

    ],
    function (angular) {
    var m = angular.module('app.widgets.nvd3-bar', ['nvd3',
                                                    'app.widgets.data-dialogs.bar-chart-dialog',
                                                    'app.widgets.data-util.adapter',

                                                    /*'app.widgets.palletes',*/
                                                    {files: ['/components/nvd3/nv.d3.css']}
                                                   ]);
    m.controller('Nvd3BarChartCtrl', function ($scope, EventEmitter, APIProvider, APIUser, BarChartDialog,adapter /*, palletes*/) {

        $scope.APIProvider =  new APIProvider($scope);
        $scope.APIUser =  new APIUser($scope);
        $scope.dialog = new BarChartDialog($scope);
        $scope.dialog.setState(0);


        $scope.setDataProvider = function(evt,provider){
            console.log(provider);
            $scope.provider = provider;
            $scope.series = adapter.getData($scope.widget.data,$scope.provider);
            if($scope.widget.data){
                $scope.dialog.restoreState($scope.widget.data,$scope.provider)
            }else {
                $scope.dialog.setState(1, $scope.provider);
            }
        }

        $scope.update = function(){
            $scope.series = adapter.getData($scope.widget.data,$scope.provider);
        }


        $scope.APIProvider.config(function(){
            console.log('widget ' + $scope.widget.instanceName + ' is (re)configuring...');
            console.log('widget config ', $scope.widget);

            if($scope.widget.datasourceName)
            $scope.APIUser.invoke($scope.widget.datasourceName, 'appendListener')
        })
         .openCustomSettings( function(){
                $scope.dialog = new BarChartDialog($scope);
                $scope.dialog.open();
            })
         .provide('setDataProvider', $scope.setDataProvider);

        $scope.$watch('widget.data', $scope.update);


        //$scope.openConfigDialog = function(){
        //    $scope.dialog = new BarChartDialog($scope);
        //    $scope.dialog.open();
        //}


        $scope.options ={
            "chart": {
                "type": "multiBarChart",
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                        return d.value;
                    },

                "height": 450,
                "margin": {
                        "top": 20,
                        "right": 20,
                        "bottom": 60,
                        "left": 45
                    },
                "clipEdge": true,
                "staggerLabels": true,
                "transitionDuration": 500,
                "stacked": false,
                "xAxis": {
                    "axisLabel": "Time (ms)",
                    "showMaxMin": false,
                    "orient": "bottom",
                    "tickValues": null,
                    "tickSubdivide": 0,
                    "tickSize": 6,
                    "tickPadding": 7,
                    "domain": [
                        0,
                        1
                    ],
                    "range": [
                        0,
                        1
                    ],
                    "margin": {
                        "top": 0,
                        "right": 0,
                        "bottom": 0,
                        "left": 0
                    },
                    "width": 75,
                    "ticks": null,
                    "height": 60,
                    "highlightZero": true,
                    "rotateYLabel": true,
                    "rotateLabels": 0,
                    "staggerLabels": false,
                    "axisLabelDistance": 12
                },
                "yAxis": {
                    "axisLabel": "Y Axis",
                        "axisLabelDistance": 40,
                        "orient": "left",
                        "tickValues": null,
                        "tickSubdivide": 0,
                        "tickSize": 6,
                        "tickPadding": 3,
                        "domain": [
                        0,
                        1
                    ],
                        "range": [
                        0,
                        1
                    ],
                        "margin": {
                        "top": 0,
                            "right": 0,
                            "bottom": 0,
                            "left": 0
                    },
                    "width": 75,
                        "ticks": null,
                        "height": 60,
                        "showMaxMin": true,
                        "highlightZero": true,
                        "rotateYLabel": true,
                        "rotateLabels": 0,
                        "staggerLabels": false
                },
                "dispatch": {},
                "multibar": {
                    "dispatch": {},
                    "margin": {
                        "top": 0,
                            "right": 0,
                            "bottom": 0,
                            "left": 0
                    },
                    "width": 960,
                        "height": 500,
                        "forceY": [
                        0
                    ],
                        "stacked": false,
                        "stackOffset": "zero",
                        "clipEdge": true,
                        "barColor": null,
                        "id": 2771,
                        "hideable": false,
                        "delay": 1200,
                        "groupSpacing": 0.1
                },
                "legend": {
                    "dispatch": {},
                    "margin": {
                        "top": 5,
                            "right": 0,
                            "bottom": 5,
                            "left": 0
                    },
                    "width": 400,
                        "height": 20,
                        "align": true,
                        "rightAlign": true,
                        "updateState": true,
                        "radioButtonMode": false
                },
                "forceY": [
                    0
                ],
                "id": 2771,
                "stackOffset": "zero",
                "delay": 1200,
                "barColor": null,
                "groupSpacing": 0.1,
                "width": 400,
                "showControls": true,
                "showLegend": true,
                "showXAxis": true,
                "showYAxis": true,
                "rightAlignYAxis": false,
                "reduceXTicks": false,
                "rotateLabels": 45,
                "tooltips": true,
                "state": {
                    "stacked": false,
                        "disabled": [
                        false,
                        false,
                        false
                    ]
                },
                "defaultState": null,
                "noData": "No Data Available."
            },
            "title": {
            "enable": true,
                "text": "Write Your Title",
                "class": "h4",
                "css": {
                "width": "nullpx",
                    "textAlign": "center"
            }
        },
            "subtitle": {
            "enable": true,
                "text": "Write Your Subtitle",
                "css": {
                "width": "nullpx",
                    "textAlign": "center"
            }
        },
            "caption": {
            "enable": true,
                "text": "Figure 1. Write Your Caption text.",
                "css": {
                "width": "nullpx",
                    "textAlign": "center"
            }
        },
            "styles": {
            "classes": {
                "with-3d-shadow": true,
                    "with-transitions": true,
                    "gallery": false
            },
            "css": {}
        }
        };

    })
});
