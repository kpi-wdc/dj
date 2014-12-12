define(['angular', 'js/shims', 'js/widget-api', 'angular-ui-router', 'ngstorage', 'angular-oclazyload',
    'angular-foundation', 'angular-json-editor', 'template-cached-pages', 'sceditor'], function (angular) {
    let app = angular.module('app', ['ui.router', 'ngStorage', 'oc.lazyLoad', 'mm.foundation',
        'angular-json-editor', 'templates', 'app.widgetApi']);

    app.constant('appUrls', {
        appConfig: '/apps/app.json',
        widgetTypes: '/widgets/widgets.json',
        widgetHolderHTML: '/views/widget-holder.html',
        widgetModalConfigHTML: '/views/widget-modal-config.html',
        templateHTML: templateName =>
            `/templates/${templateName}.html`,
        widgetJS: widgetName =>
            `/widgets/${widgetName}/widget.js`,
        widgetJSModule: widgetName =>
            `widgets/${widgetName}/widget.js`,
        widgetHTML: widgetName =>
            `/widgets/${widgetName}/widget.html`
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

        let pageConfigPromise;
        $locationProvider.html5Mode(true);

        $urlRouterProvider
            .otherwise('/404');

        $stateProvider
            .state('page', {
                url: '/:href',
                resolve: {
                    pageConfig: function ($stateParams, $q, alert, appConfigPromise, appConfig, widgetLoader) {
                        return pageConfigPromise = appConfigPromise
                            .then(() => {
                                let pageConfig = appConfig.config.pages[appConfig.pageIndexByHref($stateParams.href)];

                                let deferredResult = $q.defer();

                                let widgetTypes = [];
                                for (let holderName in pageConfig.holders) {
                                    if (pageConfig.holders.hasOwnProperty(holderName)) {
                                        for (let widget of pageConfig.holders[holderName].widgets) {
                                            widgetTypes.push(widget.type);
                                            appConfig.updateEventsOnNameChange(widget);
                                        }
                                    }
                                }
                                widgetLoader.load(widgetTypes).then(() => {
                                    deferredResult.resolve(pageConfig);
                                }, (err) => {
                                    alert.error(`Error loading widget controllers. <br><br> ${err}`);
                                    deferredResult.reject(err);
                                });

                                return deferredResult.promise;
                            }, (data) => {
                                alert.error(`Error loading app configuration: ${data.statusText} (${data.status})`);
                                return $q.reject(data.status);
                            });
                    }
                },
                templateProvider: function ($http, appUrls, $templateCache) {
                    return pageConfigPromise.then((pageConfig) => {
                        let url = appUrls.templateHTML(pageConfig.template);
                        return $http.get(url, {cache: $templateCache})
                            .then((result) => result.data);
                    });
                },
                controller: 'PageCtrl'
            });
    });

    app.service('alert', function ($modal, $log) {
        this.error = (msg) => {
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

    app.service('appConfig', function ($http, $state, $stateParams, appConfigPromise, appUrls, $rootScope) {
        this.config = {};
        this.isAvailable = false;
        this.sendingToServer = false;

        this.isHomePageOpened = () => {
            return $stateParams.href === '';
        };

        this.is404PageOpened = () => {
            return $stateParams.href === '404';
        };

        this.pageIndexByHref = (href) => {
            let result;

            for (let index = 0; index < this.config.pages.length; index++) {
                if (this.config.pages[index].href === href) {
                    return index;
                }
                if (this.config.pages[index].href === '404') {
                    result = index;
                }
            }
            return result;
        };

        this.currentPageIndex = () =>
            this.pageIndexByHref($stateParams.href);

        this.pageConfig = () => {
            if (!this.config.pages) {
                return undefined;
            }
            return this.config.pages[this.currentPageIndex()];
        };

        this.wasModified = true; // TODO: implement changing this state

        this.deletePage = (index) => {
            if (angular.isDefined(this.config.pages) && angular.isDefined(this.config.pages[index])) {
                this.config.pages.splice(index, 1);
            }
            $state.go('page', {href: ''});
        };

        this.submitToServer = (callback) => {
            this.sendingToServer = true;
            return $http.put(appUrls.appConfig, this.config)
                .then(() => {
                    this.sendingToServer = false;
                }, (data) => {
                    this.sendingToServer = false;
                    if (callback) {
                        callback(data);
                    }
                });
        };

        this.updateEventsOnNameChange = (widget) => {
            $rootScope.$watch(() => {
                return widget.instanceName;
            }, (newName, oldName) => {
                if (newName !== oldName && newName != undefined) {
                    let subscriptions = this.pageConfig().subscriptions;
                    for (let i = 0; i < (subscriptions ? subscriptions.length : 0); i++) {
                        let subscription = subscriptions[i];
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

        appConfigPromise.success((data) => {
            this.isAvailable = true;
            this.config = data;
        });
    });

    app.service('widgetLoader', function ($q, $ocLazyLoad, widgetTypesPromise, appUrls) {
        this.load = (widgets) => {
            widgets = angular.isArray(widgets) ? widgets : [widgets];
            return widgetTypesPromise.then((widgetTypesHTTP) => {
                let widgetControllers = [];
                for (let widget of widgets) {
                    let widgetType = widgetTypesHTTP.data[widget];
                    if (angular.isUndefined(widgetType)) {
                        return $q.reject(`Widget "${widget}" doesn't exist!`);
                    }
                    if (!widgetType.nojs) {
                        widgetControllers.push({
                            name: 'app.widgets.' + widget,
                            files: [appUrls.widgetJSModule(widget)]
                        });
                    }
                }
                return $ocLazyLoad.load(widgetControllers);
            });
        }
    });

    app.service('widgetManager', function ($modal, APIUser, APIProvider, widgetLoader, appUrls, prompt) {
        this.deleteIthWidgetFromHolder = (holder, index) => {
            let removedWidget = holder.widgets.splice(index, 1)[0];
            let user = new APIUser();
            user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
        };

        this.openWidgetConfigurationDialog = (widget) => {
            let invocation = (new APIUser).tryInvoke(widget.instanceName, APIProvider.OPEN_CUSTOM_SETTINGS_SLOT);
            if (!invocation.success) {
                this.openDefaultWidgetConfigurationDialog(widget);
            }
        };

        this.openDefaultWidgetConfigurationDialog = (widget) => {
            $modal.open({
                templateUrl: appUrls.widgetModalConfigHTML,
                controller: 'WidgetModalSettingsController',
                backdrop: 'static',
                resolve: {
                    widgetScope: () => {
                        return (new APIUser).getScopeByInstanceName(widget.instanceName);
                    },
                    widgetConfig: () => {
                        return widget;
                    },
                    widgetType: (widgetTypesPromise) => {
                        return widgetTypesPromise.then((widgetTypesHTTP) =>
                            widgetTypesHTTP.data[widget.type]
                        );
                    }
                }
            }).result.then((newWidgetConfig) => {
                angular.copy(newWidgetConfig, widget);
                let user = new APIUser();
                user.invokeAll(APIProvider.RECONFIG_SLOT);
            });
        };

        this.addNewWidgetToHolder = (holder) => {
            let widgetType = prompt('Widget type (like summator):');
            let instanceName = Math.random().toString(36).substring(2);
            if (widgetType) {
                widgetLoader.load(widgetType)
                    .then(() => {
                        holder.widgets = holder.widgets || [];
                        holder.widgets.push({
                            type: widgetType,
                            instanceName: instanceName
                        });
                    }, (error) => {
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
        let cnf = $scope.globalConfig = $localStorage.globalConfig;

        $scope.appConfig = appConfig;

        $scope.logIn = () => {
            cnf.loggedIn = true;
        };

        $scope.logOut = () => {
            cnf.loggedIn = false;
        };

        $scope.$watch('globalConfig.designMode', () => {
            cnf.debugMode = cnf.debugMode && !cnf.designMode;
        });

        $scope.$watch('globalConfig.loggedIn', () => {
            cnf.debugMode = cnf.debugMode && cnf.loggedIn;
            cnf.designMode = cnf.designMode && cnf.loggedIn;
        });

        $scope.alertAppConfigSubmissionFailed = (data) => {
            alert.error('Error submitting application configuration!<br>' +
                `HTTP error ${data.status}: ${data.statusText}`);
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
            link: (scope, element, attrs) => {
                scope.$watchCollection('scope.config.holders', () => {
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
        let data = $scope.widgetConfig;
        $scope.basicProperties = {
            type: widgetConfig.type,
            instanceName: widgetConfig.instanceName
        };

        $scope.ok = () => {
            // Use $timeout as a fix for android
            // On mobile devices (at least android) `data` is updated AFTER `ng-click` event happens if 
            // submit button is pressed while input fields are still focused.
            // this is probably related to touch vs mouse behaviour and underlying json-editor behaviour.
            $timeout(() => {
                $modalInstance.close(angular.extend(data, $scope.basicProperties));
            }, 100);
        };

        $scope.cancel = $modalInstance.dismiss.bind($modalInstance);

        $scope.updateData = (value) => {
            data = value;
        };
    });

    return angular.bootstrap(document, ['app'], {
        strictDi: false
    });
});
