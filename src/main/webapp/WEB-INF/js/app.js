define(['angular', 'angular-ui-router', 'angular-oclazyload',
    'angular-foundation', 'angular-json-editor', 'template-cached-pages'], function (angular) {
    "use strict";
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'mm.foundation',
        'angular-json-editor', 'templates']);

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

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, JsonEditorConfig) {

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            asyncLoader: require
        });

        // angular-json-editor configuration
        JsonEditorConfig.iconlib = 'foundation3'; // icons have their own versions
        JsonEditorConfig.theme = 'foundation5';
        JsonEditorConfig.required_by_default = true;

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

    app.service('alert', function ($modal, $log) {
        this.error = function (msg) {
            $log.error(msg);
            $modal.open({
                template: msg,
                windowClass: "error-message"
            });
        };
    });

    app.factory('widgetTypesPromise', function ($http, appUrls) {
        return $http.get(appUrls.widgetTypes);
    });

    app.factory('appConfigPromise', function ($http, appUrls) {
        return $http.get(appUrls.appConfig);
    });

    app.service('appConfig', function ($http, $state, $stateParams, appConfigPromise, appUrls) {
        var self = this;
        this.config = {};
        this.isAvailable = false;
        this.sendingToServer = false;

        this.isHomePageOpened = function () {
            return $stateParams.href === '';
        };

        this.is404PageOpened = function () {
            return $stateParams.href === '404';
        };

        this.pageIndexByHref = function (href) {
            var result;

            for (var i = 0; i < self.config.pages.length; i++) {
                if (self.config.pages[i].href === href) {
                    result = i;
                    break;
                }
                if (self.config.pages[i].href === '404') {
                    result = i;
                }
            }
            return result;
        };

        this.wasModified = true; // TODO: implement changing this state

        this.deletePage = function (index) {
            if (angular.isDefined(self.config.pages) && angular.isDefined(self.config.pages[index])) {
                self.config.pages.splice(index, 1);
            }
            $state.go('page', {href: ''});
        };

        this.submitToServer = function (callback) {
            self.sendingToServer = true;
            return $http.put(appUrls.self, self.config)
                .then(function () {
                    self.sendingToServer = false;
                }, function (data) {
                    self.sendingToServer = false;
                    if (callback) {
                        callback(data);
                    }
                });
        };

        appConfigPromise.success(function (data) {
            self.isAvailable = true;
            self.config = data;
        });
    });

    app.service('widgetLoader', function ($q, $ocLazyLoad, widgetTypesPromise, appUrls) {
        this.load = function (widgets) {
            widgets = angular.isArray(widgets) ? widgets : [widgets];
            return widgetTypesPromise.then(function (widgetTypesHTTP) {
                var widgetControllers = [];
                for (var i = 0; i < widgets.length; ++i) {
                    var widgetType = widgetTypesHTTP.data[widgets[i]];
                    if (angular.isUndefined(widgetType)) {
                        return $q.reject('Widget "' + widgets[i] + '" doesn\'t exist!');
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
        var APIProvider = function (scope) {
            var self = this;
            var providerName = function () {
                return scope && scope.widget && scope.widget.instanceName;
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

            this.config = function (slotFn, enableReconfiguring) {
                enableReconfiguring = enableReconfiguring === undefined ? true : enableReconfiguring;
                slotFn();
                if (enableReconfiguring) {
                    self.provide(APIProvider.RECONFIG_SLOT, slotFn);
                }
                return this;
            };

            this.reconfig = function (slotFn) {
                self.provide(APIProvider.RECONFIG_SLOT, slotFn);
                return this;
            };
        };

        APIProvider.RECONFIG_SLOT = 'RECONFIG_SLOT';
        return APIProvider;
    });

    app.factory('APIUser', function (widgetSlots) {
        return function (scope) {
            var userName = function () {
                return scope && scope.widget && scope.widget.instanceName;
            };

            this.invoke = function (providerName, slotName) {
                if (!widgetSlots[providerName]) {
                    throw "Provider " + providerName + " doesn't exist";
                }
                for (var i = 0; i < widgetSlots[providerName].length; i++) {
                    var slot = widgetSlots[providerName][i];
                    if (slot.slotName === slotName) {
                        return slot.fn.apply(undefined, [{
                            emitterName: userName(),
                            signalName: undefined
                        }].concat(Array.prototype.slice.call(arguments, 2)));
                    }
                }
                throw "Provider " + providerName + " doesn't have slot called " + slotName;
            };

            this.tryInvoke = function (providerName, slotName) {
                try {
                    return {
                        success: true,
                        result: invoke(providerName, slotName) // might throw
                    }
                } catch (e) {
                    if (typeof(e) === 'string' && e.indexOf("Provider") > -1) {
                        return {
                            success: false
                        }
                    } else {
                        throw e;
                    }
                }
            };

            this.invokeAll = function (slotName) {
                var called = false;
                for (var providerName in widgetSlots) {
                    if (widgetSlots.hasOwnProperty(providerName)) {
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
                    }
                }
                return called;
            }
        };
    });

    app.factory('EventEmitter', function (eventWires, widgetSlots, $log, $timeout, $rootScope) {
        var EventPublisher = function (scope) {
            var emitterName = function () {
                return scope && scope.widget && scope.widget.instanceName;
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

    app.controller('PageCtrl', function ($scope, $modal, pageConfig, alert, $window,
                                         APIUser, APIProvider, widgetLoader, appUrls) {
        $scope.config = pageConfig;
        $scope.deleteIthWidgetFromHolder = function (holder, index) {
            holder.widgets.splice(index, 1);
        };

        $scope.openWidgetConfigurationDialog = function (widget) {
            $modal.open({
                templateUrl: appUrls.widgetModalConfigHTML,
                controller: 'WidgetModalSettingsController',
                backdrop: 'static',
                resolve: {
                    widgetConfig: function () {
                        return widget;
                    },
                    widgetType: function (widgetTypesPromise) {
                        return widgetTypesPromise.then(function (widgetTypesHTTP) {
                            return widgetTypesHTTP.data[widget.type];
                        });
                    }
                }
            }).result.then(function (newWidgetConfig) {
                angular.copy(newWidgetConfig, widget);
                var user = new APIUser();
                user.invokeAll(APIProvider.RECONFIG_SLOT);
            });
        };

        $scope.addNewWidget = function (holder) {
            var widgetType = $window.prompt('Widget type (like summator):');
            var instanceName = Math.random().toString(36).substring(2);
            if (widgetType) {
                widgetLoader.load(widgetType)
                    .then(function () {
                        holder.widgets.push({
                            type: widgetType,
                            instanceName: instanceName
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

    app.controller('WidgetModalSettingsController', function ($scope, $modalInstance, widgetConfig, widgetType) {
        $scope.widgetType = widgetType;
        $scope.widgetConfig = angular.copy(widgetConfig);
        delete $scope.widgetConfig.instanceName;
        delete $scope.widgetConfig.type;
        var data = $scope.widgetConfig;
        $scope.basicProperties = {
            type: widgetConfig.type,
            instanceName: widgetConfig.instanceName
        };

        $scope.ok = function () {
            $modalInstance.close(angular.extend(data, $scope.basicProperties));
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.updateData = function (value) {
            data = value;
        };
    });

    app.controller('WidgetModalConfigButtonsController', angular.noop);

    return angular.bootstrap(document, ['app'], {
        strictDi: true
    });
});
