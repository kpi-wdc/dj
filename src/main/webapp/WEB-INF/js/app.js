define(['angular', 'jquery', 'js/shims', 'js/widget-api', 'angular-ui-router', 'ngstorage', 'angular-oclazyload',
    'angular-foundation', 'angular-json-editor', 'template-cached-pages', 'sceditor'], function (angular, $) {
    "use strict";
    var app = angular.module('app', ['ui.router', 'ngStorage', 'oc.lazyLoad', 'mm.foundation',
        'angular-json-editor', 'templates', 'app.widgetApi']);

    app.constant('appUrls', {
        appConfig: '/apps/app.json',
        widgetTypes: '/widgets/widgets.json',
        widgetHolderHTML: '/views/widget-holder.html',
        widgetModalConfigHTML: '/views/widget-modal-config.html',
        pageModalConfigHTML: '/views/page-modal-config.html',
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
                    disable_collapse: true,
                    disable_edit_json: true,
                    disable_properties: true,
                    required_by_default: true
                }
            },
            plugins: {
              sceditor: {
                  style: '/components/SCEditor/minified/jquery.sceditor.default.min.css',
                  resizeWidth: false
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
                    pageConfig: function ($stateParams, $q, alert, appConfigPromise, appConfig, widgetLoader) {
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
                                            appConfig.updateEventsOnNameChange(widgets[i]);
                                        }
                                    }
                                }
                                widgetLoader.load(widgetTypes).then(function () {
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

    app.factory('prompt', function ($window) {
        return $window.prompt;
    });

    app.factory('widgetTypesPromise', function ($http, appUrls) {
        return $http.get(appUrls.widgetTypes);
    });

    app.factory('appConfigPromise', function ($http, appUrls) {
        return $http.get(appUrls.appConfig);
    });

    app.service('appConfig', function ($http, $state, $stateParams, appConfigPromise,
                                       appUrls, $rootScope, $modal) {
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

        this.pageConfig = function () {
            if (!self.config.pages) {
                return undefined;
            }
            var index404;

            for (var i = 0; i < self.config.pages.length; i++) {
                if (self.config.pages[i].href === $stateParams.href) {
                    return self.config.pages[i];
                }
                if (self.config.pages[i].href === '404') {
                    index404 = i;
                }
            }
            return index404;
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
            return $http.put(appUrls.appConfig, self.config)
                .then(function () {
                    self.sendingToServer = false;
                }, function (data) {
                    self.sendingToServer = false;
                    if (callback) {
                        callback(data);
                    }
                });
        };

        this.updateEventsOnNameChange = function (widget) {
            $rootScope.$watch(function () {
                return widget.instanceName;
            }, function (newName, oldName) {
                if (newName !== oldName && newName != undefined) {
                    var subscriptions = self.pageConfig().subscriptions;
                    for (var i = 0; i < (subscriptions ? subscriptions.length : 0); i++) {
                        var subscription = subscriptions[i];
                        if (subscription.emitter === oldName) {
                            subscription.emitter = newName;
                        }

                        if (subscription.receiver === oldName) {
                            subscription.receiver = newName;
                        }
                    }
                }
            });
        };

        this.addNewPage = function (page) {
            self.config.pages.push(page);
        };

        this.addNewPageInModal = function () {
            $modal.open({
                templateUrl: appUrls.pageModalConfigHTML,
                controller: 'PageModalSettingsController',
                backdrop: 'static'
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

    app.service('widgetManager', function ($modal, APIUser, APIProvider, widgetLoader, appUrls, prompt) {
        this.deleteIthWidgetFromHolder = function (holder, index) {
            var removedWidget = holder.widgets.splice(index, 1)[0];
            var user = new APIUser();
            user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
        };

        this.openWidgetConfigurationDialog = function (widget) {
            var invocation = (new APIUser).tryInvoke(widget.instanceName, APIProvider.OPEN_CUSTOM_SETTINGS_SLOT);
            if (!invocation.success) {
                this.openDefaultWidgetConfigurationDialog(widget);
            }
        };

        this.openDefaultWidgetConfigurationDialog = function (widget) {
            $modal.open({
                templateUrl: appUrls.widgetModalConfigHTML,
                controller: 'WidgetModalSettingsController',
                backdrop: 'static',
                resolve: {
                    widgetScope: function () {
                        return (new APIUser).getScopeByInstanceName(widget.instanceName);
                    },
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

        this.addNewWidgetToHolder = function (holder) {
            var widgetType = prompt('Widget type (like summator):');
            var instanceName = Math.random().toString(36).substring(2);
            if (widgetType) {
                widgetLoader.load(widgetType)
                    .then(function () {
                        holder.widgets = holder.widgets || [];
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

    app.controller('MainCtrl', function ($scope, $localStorage, alert, appConfig) {
        if ($localStorage.localStorageInitialized === undefined) {
            $localStorage.globalConfig = {
                debugMode: false,
                designMode: false,
                loggedIn: false
            };
            $localStorage.localStorageInitialized = true;
        }
        var cnf = $scope.globalConfig = $localStorage.globalConfig;

        $scope.appConfig = appConfig;

        $scope.logIn = function () {
            cnf.loggedIn = true;
        };

        $scope.logOut = function () {
            cnf.loggedIn = false;
        };

        $scope.$watch('globalConfig.designMode', function () {
            cnf.debugMode = cnf.debugMode && !cnf.designMode;
        });

        $scope.$watch('globalConfig.loggedIn', function () {
            cnf.debugMode = cnf.debugMode && cnf.loggedIn;
            cnf.designMode = cnf.designMode && cnf.loggedIn;
        });

        $scope.alertAppConfigSubmissionFailed = function (data) {
            alert.error('Error submitting application configuration!<br>' +
            'HTTP error ' + data.status + ': ' + data.statusText);
        };
    });

    app.controller('PageCtrl', function ($scope, pageConfig, widgetManager) {
        $scope.config = pageConfig;
        $scope.deleteIthWidgetFromHolder = widgetManager.deleteIthWidgetFromHolder.bind(widgetManager);
        $scope.openWidgetConfigurationDialog = widgetManager.openWidgetConfigurationDialog.bind(widgetManager);
        $scope.addNewWidgetToHolder = widgetManager.addNewWidgetToHolder.bind(widgetManager);
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

    app.controller('WidgetModalSettingsController', function ($scope, $modalInstance, $timeout,
                                                              widgetScope, widgetConfig, widgetType) {
        $scope.widgetScope = widgetScope;
        $scope.widgetType = widgetType;

        $scope.widgetConfig = angular.copy(widgetConfig);
        // split widgetConfig into basicProperties (not available in json-editor)
        // and $scope.widgetConfig - everything else, modifiable in json-editor
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
            // HORRIBLE HACK!
            // sceditor doesn't want to play with foundation modal dialogs nicely.
            $('json-editor .sceditor-container iframe').height('20rem').width('98%');
        }, 0);
    });

    app.controller('PageModalSettingsController', function ($scope, $modalInstance, alert, appConfig) {
        $scope.add = function (shortTitle, href) {
            if (shortTitle && href) {
                var page = {};
                page.shortTitle = shortTitle;
                page.href = href;

                // TODO: change hard-coded template and its holders
                page.template = '1-col';
                page.holders = {
                    column: {
                        widgets: [{
                            type: "title",
                            title: "Home page"
                        }, {
                            type: "htmlwidget",
                            text: "<h3>Page Title <small>Page subtitle</small></h3>"
                        }]
                    }
                };
                appConfig.addNewPage(page);
                $modalInstance.close();
            } else {
                alert.error('All fields must be filled');
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });

    return angular.bootstrap(document, ['app'], {
        strictDi: false
    });
});
