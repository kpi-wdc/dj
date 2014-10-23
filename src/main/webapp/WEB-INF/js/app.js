define(['angular', 'angular-ui-router', 'angular-oclazyload'], function (angular) {
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            asyncLoader: require
        });

        var pageConfigPromise;
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            })
            .state('page', {
                url: '/page/:name',
                resolve: {
                    pageConfig: function ($stateParams, $q, $http, $ocLazyLoad) {
                        return pageConfigPromise = $http.get('/json/pageconfig/' + $stateParams.name + '.json')
                            .then(function (result) {
                                var config = result.data;
                                var deferredResult = $q.defer();

                                var widgetControllers = [];
                                for (var holderName in config.holders) {
                                    var widgets = config.holders[holderName].widgets;
                                    for (var i = 0; i < widgets.length; ++i) {
                                        if (!widgets[i].nojs) {
                                            widgetControllers.push({
                                                name: 'app.widgets.' + widgets[i].name,
                                                files: ['/widgets/' + widgets[i].name + '/widget.js']
                                                }
                                            );
                                        }
                                    }
                                }
                                $ocLazyLoad.load(widgetControllers).then(function () {
                                    deferredResult.resolve(config);
                                }, function () {
                                    alert('Error loading widget controllers');
                                });

                                return deferredResult.promise;
                            }, function (data) {
                                alert('Error loading page config: ' + data.statusText + ' (' + data.status + ')');
                                return $q.reject(data.status);
                            });
                    }
                },
                templateProvider: function ($http) {
                    return pageConfigPromise.then(function (pageConfig) {
                        return $http.get('/templates/' + pageConfig.template + '.html')
                            .then(function (result) {
                                return result.data;
                            });
                    });
                },
                controller: 'PageCtrl'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            });

        $urlRouterProvider.otherwise('/404');
    }).factory('pageListPromise', function ($http) {
        return $http.get('/json/pagelist.json');
    });

    app.controller('PageCtrl', function ($scope, pageConfig) {
       $scope.config = pageConfig;
       $scope.configStr = angular.toJson(pageConfig, true);
    });

    app.directive('widgetHolder', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/widget-holder.html',
            transclude: true,
            scope: true,
            link: function (scope, element, attrs) {
                scope.$watchCollection('scope.config.holders', function () {
                    if (scope.config.holders) {
                        scope.holder = scope.config.holders[attrs.name] || {};
                    }
                });

                scope.widgetTemplateUrl = function (name) {
                    return '/widgets/' + name + '/index.html';
                };
            }
        }
    });

    app.controller('SectionsController', function ($scope) {
        $scope.sections = [
            'About',
            'Index',
            'Bla-bla',
            'Some section'
        ]
    });

    app.controller('PageNavigationController', function (pageListPromise, $scope, $http) {
        pageListPromise
            .success(function (data) {
                $scope.pages = data;
            })
            .error(function (data, status) {
                alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angular.bootstrap(document, ['app']);
});