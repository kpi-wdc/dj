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
        'angular-oclazyload',
        'angular-nvd3',
        '/widgets/data-util/adapter.js'
    ],
    function (angular) {



        var m = angular.module('app.widgets.nvd3-widget',
            [   'oc.lazyLoad',
                'nvd3',
                'app.widgets.data-util.adapter'
            ]);


        m.factory('NVD3Widget',['$http','$ocLazyLoad', 'APIProvider', 'APIUser', 'adapter', 'pageSubscriptions',

            function($http, $ocLazyLoad,APIProvider, APIUser, adapter, pageSubscriptions) {

                $ocLazyLoad.load( {files: [
                    '/components/nvd3/nv.d3.css',
                    '/widgets/nvd3-widget/nvd3-widget.css'
                ]});

                var NVD3Widget = function($scope,params){
                    $scope.APIProvider = new APIProvider($scope);
                    $scope.APIUser = new APIUser($scope);

                    $scope.removeSubscriptions = function(){
                        var subscriptions = pageSubscriptions();
                        for(var i in subscriptions){
                            //console.log(subscriptions[i],$scope.widget.instanceName)
                            if( subscriptions[i].emitter == $scope.widget.instanceName
                                || subscriptions[i].receiver == $scope.widget.instanceName
                            )   subscriptions.splice(i,1);

                        }
                    }

                    $scope.serieExist = function(){
                        return angular.isDefined($scope.series)
                    }

                    $scope.configExist = function(){
                        return angular.isDefined($scope.widget.data)
                    }


                    $http.get(params.optionsURL).success(
                        function (data) {
                            $scope.options = data;
                            for(var i in params.serieAdapter ){
                                $scope.options.chart[i] = params.serieAdapter[i];
                            }

                            $scope.options.chart.x = params.serieAdapter.getX;
                            $scope.options.chart.y = params.serieAdapter.getY;
                            //$scope.options.chart.tooltipContent = params.serieAdapter.tooltipContent;

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
                                params.serieAdapter.getSeries(adapter.getData($scope.widget.data, $scope.provider, params.serieGenerator)):
                                adapter.getData($scope.widget.data, $scope.provider, params.serieGenerator);

                            return;
                            }
                            if ($scope.widget.datasource) {
                                //console.log("Invoke appendListener",$scope.widget.datasource);
                                $scope.APIUser.invoke($scope.widget.datasource, 'appendListener')
                            }
                        }, true)

                        .removal(function(){
                            $scope.removeSubscriptions();
                        })

                        .openCustomSettings(function () {
                            $scope.dialog = new params.dialog($scope);
                            $scope.dialog.open();
                        })

                        .provide('setDataProvider', function (evt, provider) {
                            if(!provider) return;
                                //console.log('setDataProvider',evt,provider)
                                $scope.provider = provider;
                                $scope.series = (params.serieAdapter.getSeries) ?
                                    params.serieAdapter.getSeries(adapter.getData($scope.widget.data, $scope.provider, params.serieGenerator)) :
                                    adapter.getData($scope.widget.data, $scope.provider, params.serieGenerator);
                        });
                    //console.log("NVD3 WIDGET",this)
            };



            return NVD3Widget;

        }]);
    });
