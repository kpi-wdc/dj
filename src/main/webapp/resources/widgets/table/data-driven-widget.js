define([
        'angular',
        'angular-oclazyload',
        '/widgets/data-util/adapter.js',
        '/widgets/data-util/table-adapter.js'

    ],
    function (angular) {



        var m = angular.module('app.widgets.data-driven-widget',
            [   'oc.lazyLoad',
                'app.widgets.data-util.adapter',
                'app.widgets.data-util.table-adapter'

            ]);


        m.factory('DataDrivenWidget',['$http','$ocLazyLoad', 'APIProvider', 'APIUser', 'adapter','TableAdapter',

            function($http, $ocLazyLoad, APIProvider, APIUser, adapter, TableAdapter) {

                $ocLazyLoad.load( {files: ['/widgets/table/table-widget.css']});

                var DataDrivenWidget = function($scope,params){

                    $scope.APIProvider = new APIProvider($scope);
                    $scope.APIUser = new APIUser($scope);

                    $scope.APIProvider
                        .config(function () {
                            if ($scope.widget.data && $scope.widget.data.standalone) {
                                $scope.table = TableAdapter.getData(adapter.getData($scope.widget.data, $scope.provider));
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
                            $scope.table = TableAdapter.getData(adapter.getData($scope.widget.data, $scope.provider));
                        });
            };

            return DataDrivenWidget;

        }]);
    });
