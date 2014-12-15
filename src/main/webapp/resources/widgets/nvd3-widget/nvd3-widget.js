require.config({
    paths: {
        'd3': '/components/d3/d3',
        'nv.d3': '/components/nvd3/nv.d3',
        'nv.d3.ext':'/widgets/nvd3-widget/nv.d3.ext',
        'angular-nvd3': '/components/angular-nvd3/dist/angular-nvd3'
    },
    shim: {
        'd3': {
            exports: 'd3'
        },
        'nv.d3': {
            exports: 'nv',
            deps: ['d3']
        },

        'nv.d3.ext': {

            deps: ['nv.d3']
        },

        'angular-nvd3': {
            deps: ['nv.d3']
        }
    }
});

define([
        'angular',
        'angular-oclazyload',
        'nv.d3.ext',
        'angular-nvd3',
        '/widgets/data-dialogs/palettes.js',
        '/widgets/data-util/adapter.js'
    ],
    function (angular) {



        var m = angular.module('app.widgets.nvd3-widget',
            [   'oc.lazyLoad',
                'nvd3',
                'app.widgets.palettes',
                'app.widgets.data-util.adapter'
            ]);


        m.factory('NVD3Widget',['$http','$ocLazyLoad', 'APIProvider', 'APIUser', 'adapter','Palettes',

            function($http, $ocLazyLoad,APIProvider, APIUser, adapter, Palettes) {

                $ocLazyLoad.load( {files: ['/components/nvd3/nv.d3.css','/widgets/nvd3-widget/nvd3-widget.css']});

                var NVD3Widget = function($scope,params){
                    $scope.APIProvider = new APIProvider($scope);
                    $scope.APIUser = new APIUser($scope);

                    $http.get(params.optionsURL).success(
                        function (data) {
                            $scope.options = data;

                            $scope.options.chart.x = params.serieAdapter.getX;
                            $scope.options.chart.y = params.serieAdapter.getY;
                            $scope.options.chart.tooltipContent = params.serieAdapter.tooltipContent;

                            //$scope.options.chart.color = function (d,i) {
                            //    return Palettes["Spectral"][6][i%6]
                            //};

                            if($scope.widget.decoration) {
                                $scope.options = params.decorationAdapter.applyDecoration($scope.options, $scope.widget.decoration)
                            }else{
                                $scope.widget.decoration = params.decorationAdapter.getDecoration($scope.options);
                            }

                        });

                    $scope.APIProvider

                        .config(function () {
                            if($scope.widget.decoration) {
                                $scope.options = params.decorationAdapter.applyDecoration($scope.options, $scope.widget.decoration)
                            }else{
                                $scope.widget.decoration = params.decorationAdapter.getDecoration($scope.options);
                            }
                            if ($scope.widget.data && $scope.widget.data.standalone) {
                                $scope.series = (params.serieAdapter.getSeries)?
                                params.serieAdapter.getSeries(adapter.getData($scope.widget.data, $scope.provider)):
                                adapter.getData($scope.widget.data, $scope.provider);

                            return;
                            }
                            if ($scope.widget.datasource)
                                $scope.APIUser.invoke($scope.widget.datasource, 'appendListener')
                        }, true)

                        .openCustomSettings(function () {
                            $scope.dialog = new params.dialog($scope);
                            $scope.dialog.open();
                        })

                        .provide('setDataProvider', function (evt, provider) {
                            $scope.provider = provider;
                            $scope.series = (params.serieAdapter.getSeries)?
                                params.serieAdapter.getSeries(adapter.getData($scope.widget.data, $scope.provider)):
                                adapter.getData($scope.widget.data, $scope.provider);

                        });
            };

            return NVD3Widget;

        }]);
    });
