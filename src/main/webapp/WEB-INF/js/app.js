define(['angular', 'jquery', 'js/widget-api', 'angular-ui-router', 'angular-oclazyload',
    'angular-foundation', 'angular-json-editor', 'template-cached-pages', 'sceditor'], function (angular, $) {
    "use strict";
    var app = angular.module('app', ['ui.router', 'oc.lazyLoad', 'mm.foundation',
        'angular-json-editor', 'templates', 'app.widgetApi']);

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

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, JSONEditorProvider) {

        $ocLazyLoadProvider.config({
            loadedModules: ['app'],
            asyncLoader: require
        });

        JSONEditorProvider.configure({
            defaults: {
                options: {
                    iconlib: 'foundation3',
                    theme: 'foundation5',
                    required_by_default: true
                }
            },
            plugins: {
              sceditor: {
                  style: '/components/SCEditor/minified/jquery.sceditor.default.min.css',
                  resizeWidth: false,
                  height: '300',
                  width: '100%'
              }
            }
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
            var removedWidget = holder.widgets.splice(index, 1)[0];
            var user = new APIUser();
            user.tryInvoke(removedWidget.instanceName, APIProvider.DESTROY_SLOT);
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

    app.controller('WidgetModalSettingsController', function ($scope, $modalInstance, $timeout, widgetConfig, widgetType) {
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

        $timeout(function () {
            $('json-editor .sceditor-container iframe').height('20rem').width('98%');
        }, 0);
    });

    app.controller('WidgetModalConfigButtonsController', angular.noop);

    return angular.bootstrap(document, ['app'], {
        strictDi: false
    });
});
