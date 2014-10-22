define(['angular', 'angular-ui-router'], function (angular) {
    var app = angular.module('app', ['ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider,
                         $controllerProvider, $provide, $compileProvider) {
        function addSupportForComponentLoadingAfterBootstrapHack() {
            // Let's keep the older references.
            app._controller = app.controller;
            app._service = app.service;
            app._factory = app.factory;
            app._value = app.value;
            app._directive = app.directive;

            // Provider-based controller.
            app.controller = function (name, constructor) {
                $controllerProvider.register(name, constructor);
                return this;
            };

            // Provider-based service.
            app.service = function (name, constructor) {
                $provide.service(name, constructor);
                return this;
            };

            // Provider-based factory.
            app.factory = function (name, factory) {
                $provide.factory(name, factory);
                return this;
            };

            // Provider-based value.
            app.value = function (name, value) {
                $provide.value(name, value);
                return this;
            };

            // Provider-based directive.
            app.directive = function (name, factory) {
                $compileProvider.directive(name, factory);
                return this;
            };

            app.filter = function (name, filter) {
                $filterProvider.filter(name, filter);
            };
        }
        addSupportForComponentLoadingAfterBootstrapHack();

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
                    pageConfig: function ($stateParams, $q, $http) {
                        return pageConfigPromise = $http.get('/json/pageconfig/' + $stateParams.name + '.json')
                            .then(function (result) {
                                var config = result.data;
                                var deferredResult = $q.defer();

                                var widgetControllers = [];
                                for (var holderName in config.holders) {
                                    var widgets = config.holders[holderName].widgets;
                                    for (var i = 0; i < widgets.length; ++i) {
                                        if (!widgets[i].nojs) {
                                            widgetControllers.push('widgets/' + widgets[i].href);
                                        }
                                    }
                                }
                                require(widgetControllers, function () {
                                    deferredResult.resolve(config);
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
                        return $http.get('/templates/' + pageConfig.templateName + '.html')
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
                        scope.holderConfig = scope.config.holders[attrs.name] || {};
                    }
                });

                scope.widgetTemplateUrl = function (href) {
                    return '/views/widgets/' + href + '.html';
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

    angular.bootstrap(document, ['app']);
    return app;
});