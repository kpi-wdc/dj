define(['angular', 'angular-ui-router', 'angular-oclazyload', 'angular-foundation', 'template-cached-pages'], function (angular) {
    "use strict";
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'mm.foundation', 'templates']);

    app.constant('appUrls', {
        appConfig: '/apps/app.json',
        widgetTypes: '/widgets/widgets.json',
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
                    pageConfig: function ($stateParams, $q, alert, appConfigPromise, appConfig, widgetLoader, EventEmitter) {
                        return pageConfigPromise = appConfigPromise
                            .then(function () {
                                var pageConfig = appConfig.config.pages[appConfig.pageIndexByHref($stateParams.href)];

                                var deferredResult = $q.defer();

                                var widgetTypes = [];
                                for (var holderName in pageConfig.holders) {
                                    if (pageConfig.holders.hasOwnProperty(holderName)) {
                                        var widgets = pageConfig.holders[holderName].widgets;
                                        for (var i = 0; i < widgets.length; ++i) {
                                            widgetTypes.push(widgets[i].type);
                                        }
                                    }
                                }
                                widgetLoader.load(widgetTypes).then(function () {
                                    EventEmitter.replacePageSubscriptions(pageConfig.subscriptions);
                                    deferredResult.resolve(pageConfig);
                                }, function (err) {
                                    alert.error('Error loading widget controllers. <br><br>' + err);
                                    deferredResult.reject(err);
                                });

                                return deferredResult.promise;
                            }, function (data) {
                                alert.error('Error loading app configuration: ' + data.statusText + ' (' + data.status + ')');
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

    app.factory('alert', function ($modal, $log) {
        return {
            error: function (msg) {
                $log.error(msg);
                $modal.open({
                    template: msg,
                    windowClass: "error-message"
                });
            }
        }
    });

    app.factory('widgetTypesPromise', function ($http, appUrls) {
        return $http.get(appUrls.widgetTypes);
    });

    app.factory('appConfigPromise', function ($http, appUrls) {
        return $http.get(appUrls.appConfig);
    });

    app.factory('appConfig', function ($http, $state, $stateParams, appConfigPromise, appUrls) {
        var appConfig = {
            config: {},
            isAvailable: false,
            sendingToServer: false,
            isHomePageOpened: function () {
                return $stateParams.href === '';
            },
            is404PageOpened: function () {
                return $stateParams.href === '404';
            },
            pageIndexByHref: function (href) {
                var result;

                for (var i = 0; i < appConfig.config.pages.length; i++) {
                    if (appConfig.config.pages[i].href === href) {
                        result = i;
                        break;
                    }
                    if (appConfig.config.pages[i].href === '404') {
                        result = i;
                    }
                }
                return result;
            },
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
            appConfig.isAvailable = true;
            appConfig.config = data;
        });

        return appConfig;
    });

    app.service('widgetLoader', function ($q, $ocLazyLoad, widgetTypesPromise, appUrls) {
        this.load = function (widgets) {
            widgets = angular.isArray(widgets) ? widgets : [widgets];
            return widgetTypesPromise.then(function (widgetTypesHTTP) {
                var widgetControllers = [];
                for (var i = 0; i < widgets.length; ++i) {
                    var widgetType = widgetTypesHTTP.data[widgets[i]];
                    if (angular.isUndefined(widgetType)) {
                        return $q.reject('Widget "' + widgets[i] +'" doesn\'t exist!');
                    }
                    if (!widgetType.nojs) {
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

    app.factory('EventEmitter', function (eventWires, widgetSlots, $log, $timeout, $rootScope) {
        var EventPublisher =  function (scope) {
            var emitterName = function () {
                return scope.widget.instanceName;
            };

            this.emit = function (signalName) {
                var args = Array.prototype.slice.call(arguments, 1);

                $rootScope.$evalAsync(function () {
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
                                if (!slots[j] || slots[j].slotName !== wire.slotName) continue;
                                slots[j].fn.apply(undefined, [{
                                    emitterName: emitterName(),
                                    signalName: signalName
                                }].concat(args));
                            }
                        }
                    }
                });
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

    app.controller('MainCtrl', function ($scope, alert, appConfig) {
        var cnf = $scope.globalConfig = {
            debugMode: false,
            designMode: true
        };

        $scope.appConfig = appConfig;

        $scope.$watch('globalConfig.designMode', function () {
            cnf.debugMode = cnf.debugMode && !cnf.designMode;
        });

        $scope.alertAppConfigSubmissionFailed = function (data) {
            alert.error('Error submitting application configuration!<br>' +
                'HTTP error ' + data.status + ': ' + data.statusText);
        };
    });

    app.controller('PageCtrl', function ($scope, $modal, pageConfig, alert, $window, widgetLoader, appUrls) {
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
                        alert.error('Cannot add widget: ' + error);
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
