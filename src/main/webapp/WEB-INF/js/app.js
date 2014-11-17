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
                                          appConfigPromise, appConfig, widgetLoader, EventEmitter) {
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
                                    EventEmitter.replacePageSubscriptions(config.subscriptions);
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

    app.constant('eventWires', {}); // emitterName -> [{signalName, providerName, slotName}]
    app.constant('widgetSlots', {}); // providerName -> [{slotName, fn}]

    app.factory('APIProvider', function (widgetSlots) {
        return function (scope) {
            var providerName = function () {
                return scope.widget.instanceName;
            };
            scope.$on('$destroy', function () {
                delete widgetSlots[providerName()];
            });

            this.provide = function (slotName, slot) {
                if (typeof slot !== 'function') {
                    throw "Second argument should be a function, " +
                        (typeof slot) + "passed instead";
                }
                widgetSlots[providerName()] = widgetSlots[providerName()] || [];
                widgetSlots[providerName()].push({
                    slotName: slotName,
                    fn: slot
                });
                return this;
            };
        };
    });

    app.factory('APIUser', function (widgetSlots) {
        return function (scope) {
            var userName = function () {
                return scope.widget.instanceName;
            };

            this.invoke = function (providerName, slotName) {
                if (!widgetSlots[providerName]) {
                    return false;
                }
                // TODO invoke should return slot's return value
                // check that there is only one slot
                var called = false;
                for (var i = 0; i < widgetSlots[providerName].length; i++) {
                    var slot = widgetSlots[providerName][i];
                    if (slot.slotName === slotName) {
                        called = true;
                        slot.fn.apply(undefined, [{
                            emitterName: userName(),
                            signalName: undefined
                        }].concat(Array.prototype.slice.call(arguments, 2)));
                    }
                }
                return called;
            };
        };
    });

    app.factory('EventEmitter', function (eventWires, widgetSlots, $log) {
        var EventPublisher =  function (scope) {
            var emitterName = function () {
                return scope.widget.instanceName;
            };

            this.emit = function (signalName) {
                if (!emitterName() || typeof emitterName() !== "string") {
                    $log.info("Not emitting event because widget's instanceName is not set");
                }
                var wires = eventWires[emitterName()];
                if (!wires) {
                    return;
                }
                for (var i = 0; i < wires.length; i++) {
                    var wire = wires[i];
                    if (wire && wire.signalName === signalName) {

                        var slots = widgetSlots[wire.providerName];
                        if (!slots) {
                            continue;
                        }

                        for (var j = 0; j < slots.length; j++) {
                            if (!slots[j]) continue;
                            slots[j].fn.apply(undefined, [{
                                emitterName: emitterName(),
                                signalName: signalName
                            }].concat(Array.prototype.slice.call(arguments, 1)));
                        }
                    }
                }
            };
        };

        EventPublisher.wireSignalWithSlot = function (emitterName, signalName, provideName, slotName) {
            eventWires[emitterName] = eventWires[emitterName] || [];
            eventWires[emitterName].push({
                signalName: signalName,
                providerName: provideName,
                slotName: slotName
            });
        };

        EventPublisher.replacePageSubscriptions = function (subsriptions) {
            for (var emitterName in eventWires) {
                if (eventWires.hasOwnProperty(emitterName)) {
                    delete eventWires[emitterName];
                }
            }

            if (!subsriptions) {
                return;
            }
            for (var i = 0; i < subsriptions.length; i++) {
                var s = subsriptions[i];
                EventPublisher.wireSignalWithSlot(s.emitter, s.signal, s.receiver, s.slot);
            }
        };

        return EventPublisher;
    });

    app.controller('MainCtrl', function ($scope, $window, appConfig) {
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
