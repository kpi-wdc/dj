require.config({
    paths: {
        'd3': '/components/d3/d3',
        'nv.d3': '/components/nvd3/nv.d3',
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
        'angular-nvd3': {
            deps: ['nv.d3']
        }
    }
});

define([
        'angular',
        'angular-nvd3',
        '/widgets/data-dialogs/line-chart-dialog.js',
        '/widgets/data-util/adapter.js',
        '/widgets/nvd3-line/nvd3-line-adapter.js'
    ],
    function (angular) {

        var m = angular.module('app.widgets.nvd3-line',
            ['nvd3',
                'app.widgets.data-dialogs.line-chart-dialog',
                'app.widgets.data-util.adapter',
                'app.widgets.nvd3.nvd3-line-adapter',
                {files: ['/components/nvd3/nv.d3.css']}
            ]);
        m.controller('Nvd3LineChartCtrl',
            function ($scope, $http, EventEmitter, APIProvider, APIUser, LineChartDialog, adapter, NVD3LineAdapter) {

                $scope.APIProvider = new APIProvider($scope);
                $scope.APIUser = new APIUser($scope);

                $http.get("/widgets/nvd3-line/options.json").success(
                    function (data) {
                        $scope.options = data;
                        $scope.options.chart.x = function (d) {
                            return d.x
                        };
                        $scope.options.chart.y = function (d) {
                            return d.y
                        };

                        if($scope.widget.decoration) {
                            $scope.options = NVD3LineAdapter.applyDecoration($scope.options, $scope.widget.decoration)
                        }else{
                            $scope.widget.decoration = NVD3LineAdapter.getDecoration($scope.options);
                        }

                    });

                $scope.APIProvider

                    .config(function () {
                        if($scope.widget.decoration) {
                            $scope.options = NVD3LineAdapter.applyDecoration($scope.options, $scope.widget.decoration)
                        }else{
                            $scope.widget.decoration = NVD3LineAdapter.getDecoration($scope.options);
                        }
                        if ($scope.widget.data && $scope.widget.data.standalone) {
                        $scope.series = adapter.getData($scope.widget.data);
                        return;
                        }
                        if ($scope.widget.datasource)
                            $scope.APIUser.invoke($scope.widget.datasource, 'appendListener')
                    }, true)

                    .openCustomSettings(function () {
                        $scope.dialog = new LineChartDialog($scope);
                        $scope.dialog.open();
                    })

                    .provide('setDataProvider', function (evt, provider) {
                        $scope.provider = provider;
                        $scope.series = adapter.getData($scope.widget.data, $scope.provider);
                    });
            })
    });
