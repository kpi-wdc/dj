define(['angular', 'angular-ui-router', 'angular-oclazyload', 'angular-foundation', 'template-cached-pages'], function (angular) {
    "use strict";
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'mm.foundation', 'templates']);

    app.constant('appUrls', {
        appConfig: '/apps/app.json',
        widgetsSetup: '/widgets/widgets.json',
        widgetHolderHTML: '/views/widget-holder.html',
        widgetModalConfigHTML: '/views/widget-modal-config.html',
        templateHTML: function (templateName) {
            return '/templates/' + templateName + '.html';
        },
        widgetJS: function (widgetName) {
            return '/widgets/' + widgetName + '/widget.js';
        },
        widgetJSModule: function (widgetName) {
            return 'widgets/' + widgetName + '/widget.js';
        },
        widgetHTML: function (widgetName) {
            return '/widgets/' + widgetName + '/widget.html';
        }
    });

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
                    pageConfig: function ($stateParams, $q, $http, $ocLazyLoad, $window, $state,
                                          appConfigPromise, appConfig, widgetLoader) {
                        appConfig.isHomePageOpened = $stateParams.href === '';
                        appConfig.is404PageOpened = $stateParams.href === '404';
                        return pageConfigPromise = appConfigPromise
                            .then(function (p) {
                                var configList = p.data.pages;
                                var config;
                                var alternateConfig;
                                appConfig.currentPageIndex = undefined;
                                for (var i = 0; i < configList.length; i++) {
                                    if ($stateParams.href === configList[i].href) {
                                        config = configList[i];
                                        appConfig.currentPageIndex = i;
                                        break;
                                    }
                                    if (configList[i].href === '404') {
                                        alternateConfig = configList[i];
                                        appConfig.currentPageIndex = i;
                                    }
                                }

                                config = config || alternateConfig;

                                var deferredResult = $q.defer();

                                var widgetTypes = [];
                                for (var holderName in config.holders) {
                                    var widgets = config.holders[holderName].widgets;
                                    for (var i = 0; i < widgets.length; ++i) {
                                        widgetTypes.push(widgets[i].type);
                                    }
                                }
                                widgetLoader.load(widgetTypes).then(function () {
                                    deferredResult.resolve(config);
                                }, function (err) {
                                    $window.alert('Error loading widget controllers. \n\n' + err);
                                    deferredResult.reject(err);
                                });

                                return deferredResult.promise;
                            }, function (data) {
                                $window.alert('Error loading app configuration: ' + data.statusText + ' (' + data.status + ')');
                                return $q.reject(data.status);
                            });
                    }
                },
                templateProvider: function ($http, appUrls, $templateCache) {
                    return pageConfigPromise.then(function (pageConfig) {
                        var url = appUrls.templateHTML(pageConfig.template);
                        return $http.get(url, {cache: $templateCache})
                                .then(function (result) {
                                    return result.data;
                                });
                    });
                },
                controller: 'PageCtrl'
            });
    });

    app.factory('widgetsSetupPromise', function ($http, appUrls) {
        return $http.get(appUrls.widgetsSetup);
    });

    app.factory('appConfigPromise', function ($http, appUrls) {
        return $http.get(appUrls.appConfig);
    });

    app.factory('appConfig', function ($http, $state, appConfigPromise, appUrls) {
        var appConfig = {
            config: {},
            sendingToServer: false,
            wasModified: true, // TODO: implement changing this state
            deletePage: function (index) {
                if (angular.isDefined(appConfig.config.pages) && angular.isDefined(appConfig.config.pages[index])) {
                    appConfig.config.pages.splice(index, 1);
                }
                $state.go('page', {href: ''});
            },
            submitToServer: function (callback) {
                appConfig.sendingToServer = true;
                return $http.put(appUrls.appConfig, appConfig.config)
                    .then(function () {
                        appConfig.sendingToServer = false;
                    }, function (data) {
                        appConfig.sendingToServer = false;
                        if (callback) {
                            callback(data);
                        }
                    });
            }
        };

        appConfigPromise.success(function (data) {
            appConfig.config = data;
        });

        return appConfig;
    });

    app.service('widgetLoader', function ($q, $ocLazyLoad, appConfigPromise, widgetsSetupPromise, appUrls) {
        this.load = function (widgets) {
            widgets = angular.isArray(widgets) ? widgets : [widgets];
            return widgetsSetupPromise.then(function (widgetsSetupHTTP) {
                var widgetControllers = [];
                for (var i = 0; i < widgets.length; ++i) {
                    var widgetSetup = widgetsSetupHTTP.data[widgets[i]];
                    if (angular.isUndefined(widgetSetup)) {
                        return $q.reject('Widget "' + widgets[i] +'" doesn\'t exist!');
                    }
                    if (!widgetSetup.nojs) {
                        widgetControllers.push({
                            name: 'app.widgets.' + widgets[i],
                            files: [appUrls.widgetJSModule(widgets[i])]
                        });
                    }
                }
                return $ocLazyLoad.load(widgetControllers);
            });
        }
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

    app.controller('MainController', function ($scope, $window, appConfig) {
        var cnf = $scope.globalConfig = {
            debugMode: false,
            designMode: true
        };

        $scope.appConfig = appConfig;

        $scope.$watch('globalConfig.designMode', function () {
            cnf.debugMode = cnf.debugMode && !cnf.designMode;
        });

        $scope.alertAppConfigSubmissionFailed = function (data) {
            $window.alert('Error submitting application configuration!\n' +
                'HTTP error ' + data.status + ': ' + data.statusText);
        };
    });

    app.controller('PageCtrl', function ($scope, $modal, pageConfig, $window, widgetLoader, appUrls) {
        $scope.config = pageConfig;
        $scope.deleteIthWidgetFromHolder = function (holder, index) {
            holder.widgets.splice(index, 1);
        };

        $scope.openWidgetConfigurationDialog = function (widget) {
            $modal.open({
                templateUrl: appUrls.widgetModalConfigHTML,
                controller: 'WidgetModalSettingsController',
                resolve: {
                    widgetConfig: function () {
                        return angular.copy(widget)
                    }
                }
            }).result.then(function (newWidgetConfig) {
                angular.copy(newWidgetConfig, widget);
            })
        };

        $scope.addNewWidget = function (holder) {
            var widgetType = $window.prompt('Widget type (like summator):');
            if (widgetType) {
                widgetLoader.load(widgetType)
                    .then(function () {
                        holder.widgets.push({
                            type: widgetType
                        });
                    }, function (error) {
                        $window.alert('Cannot add widget: ' + error);
                    });
            }
        };
    });

    app.directive('widgetHolder', function (appUrls) {
        return {
            restrict: 'E',
            templateUrl: appUrls.widgetHolderHTML,
            transclude: true,
            scope: true,
            link: function (scope, element, attrs) {
                scope.$watchCollection('scope.config.holders', function () {
                    if (scope.config.holders) {
                        scope.holder = scope.config.holders[attrs.name] || {};
                    }
                });

                scope.widgetTemplateUrl = appUrls.widgetHTML;
            }
        }
    });

    app.controller('WidgetModalSettingsController', function ($scope, $modalInstance, widgetConfig) {
        $scope.widgetConfig = widgetConfig;

        $scope.ok = function () {
            $modalInstance.close(widgetConfig);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return angular.bootstrap(document, ['app'], {
        strictDi: false // should be false when non-minified js is used
    });
});
