define(['angular', 'angular-ui-router', 'angular-oclazyload'], function (angular) {
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider) {

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            asyncLoader: require
        });

        var pageConfigPromise;
        $locationProvider.html5Mode(true);

        $urlRouterProvider
            .otherwise('/404');

        $stateProvider
            .state('page', {
                url: '/:href',
                resolve: {
                    pageConfig: function ($stateParams, $q, $http, $ocLazyLoad, $window, $state, pageConfigsPromise) {
                        return pageConfigPromise = pageConfigsPromise
                            .then(function (result) {
                                var configList = result.data;
                                var config;
                                var alternateConfig;
                                for (var i = 0; i < configList.length; i++) {
                                    if ($stateParams.href === configList[i].href) {
                                        config = configList[i];
                                        break;
                                    }
                                    if (configList[i].href === '404') {
                                        alternateConfig = configList[i];
                                    }
                                }

                                config = config || alternateConfig;

                                var deferredResult = $q.defer();

                                var widgetControllers = [];
                                for (var holderName in config.holders) {
                                    var widgets = config.holders[holderName].widgets;
                                    for (var i = 0; i < widgets.length; ++i) {
                                        if (!widgets[i].nojs) {
                                            widgetControllers.push({
                                                    name: 'app.widgets.' + widgets[i].type,
                                                    files: ['/widgets/' + widgets[i].type + '/widget.js']
                                                }
                                            );
                                        }
                                    }
                                }
                                $ocLazyLoad.load(widgetControllers).then(function () {
                                    deferredResult.resolve(config);
                                }, function (err) {
                                    $window.alert('Error loading widget controllers. \n\n' + err);
                                    deferredResult.reject(err);
                                });

                                return deferredResult.promise;
                            }, function (data) {
                                $window.alert('Error loading page configurations: ' + data.statusText + ' (' + data.status + ')');
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
            });
    });

    app.factory('pageConfigsPromise', function ($http) {
        return $http.get('/config/pages.json');
    });

    app.service('widgetEvents', function() {
        var subscriptions = [];

        this.createPublisher = function (scope) {
            var publisherName = scope.widget.instanceName;
            return {
                send: function (eventName) {
                    if (publisherName && typeof publisherName === "string") {
                        for (var i = 0; i < subscriptions.length; i++) {
                            var subscription = subscriptions[i];
                            if (subscription && subscription.eventName === eventName &&
                                    subscription.publisherName === publisherName) {
                                var slicedArgs = Array.prototype.slice.call(arguments, 1);
                                subscription.callback.apply({}, slicedArgs);
                            }
                        }
                    }
                }
            }
        };

        this.createSubscriber = function (scope) {
            scope.$on('destroy', function () {
                for (var i = 0; i < subscriptions.length; ++i) {
                    if (subscriptions[i] && subscriptions[i].subscriberScope === scope) {
                        delete subscriptions[i];
                    }
                }
            });

            return {
                on: function (slotName, callback) {
                    if (scope.widget.subscriptions) {
                        for (var i = 0; i < scope.widget.subscriptions.length; i++) {
                            var subscription = scope.widget.subscriptions[i];
                            if (subscription.slot === slotName) {
                                subscriptions.push({
                                    eventName: subscription.event,
                                    publisherName: subscription.publisher,
                                    subscriberScope: scope,
                                    callback: callback
                                });
                            }
                        }
                    }
                }
            }
        };
    });

    app.controller('BodyController', function ($scope) {
        var cnf = $scope.globalConfig = {
            debugMode: false,
            designMode: true
        };

        $scope.$watch('globalConfig.designMode', function () {
            cnf.debugMode = cnf.debugMode && !cnf.designMode;
        });
    });

    app.controller('PageCtrl', function ($scope, pageConfig) {
        $scope.config = pageConfig;
        $scope.deleteIthWidgetFromHolder = function (holder, index) {
            holder.widgets.splice(index, 1);
        };
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

                scope.widgetTemplateUrl = function (type) {
                    return '/widgets/' + type + '/index.html';
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

    app.controller('PageNavigationController', function (pageConfigsPromise, $scope, $http, $window) {
        pageConfigsPromise
            .success(function (data) {
                $scope.pages = data;
            })
            .error(function (data, status) {
                $window.alert('$http error ' + status + ' - cannot load config/pages.json!');
            });
    });

    return angular.bootstrap(document, ['app']);
});
