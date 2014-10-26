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
            .when('/', '/home')
            .otherwise('/404');

        $stateProvider
            .state('page', {
                url: '/:name',
                resolve: {
                    pageConfig: function ($stateParams, $q, $http, $ocLazyLoad, $window, $state) {
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
                                }, function (err) {
                                    $window.alert('Error loading widget controllers. \n\n' + err);
                                    deferredResult.reject(err);
                                });

                                return deferredResult.promise;
                            }, function (data) {
                                // $window.alert('Error loading page config: ' + data.statusText + ' (' + data.status + ')');
                                $state.go('page', {name: 404});
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

    app.factory('pageListPromise', function ($http) {
        return $http.get('/json/pagelist.json');
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
        $scope.globalConfig = {
            debugMode: false
        }
    });

    app.controller('PageCtrl', function ($scope, pageConfig) {
       $scope.config = pageConfig;
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

    app.controller('PageNavigationController', function (pageListPromise, $scope, $http, $window) {
        pageListPromise
            .success(function (data) {
                $scope.pages = data;
            })
            .error(function (data, status) {
                $window.alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angular.bootstrap(document, ['app']);
});
