define(['angular', 'js/shims', 'js/widget-api', 'js/info', 'angular-ui-router', 'ngstorage', 'angular-oclazyload',
  'angular-foundation', 'angular-json-editor', 'angular-cookies',
  'template-cached-pages', 'sceditor'], function (angular) {
  let app = angular.module('app', ['ui.router', 'ngStorage', 'oc.lazyLoad', 'mm.foundation',
    'ngCookies', 'angular-json-editor', 'templates', 'app.widgetApi', 'info']);

  app.constant('appUrls', {
    appConfig: `/api/app/config/${window.appName}`,
    templateTypes: '/templates/templates.json',
    widgetTypes: '/widgets/widgets.json',
    widgetHolderHTML: '/partials/widget-holder.html',
    widgetModalConfigHTML: '/partials/widget-modal-config.html',
    pageModalConfigHTML: '/partials/page-modal-config.html',
    widgetModalAddNewHTML: '/partials/widget-modal-add-new.html',
    defaultWidgetIcon: '/widgets/default_widgets_icon.png',
    templateHTML: templateName =>
      `/templates/${templateName}/template.html`,
    templateIcon: templateName =>
      `/templates/${templateName}/icon.png`,
    widgetJS: widgetName =>
      `/widgets/${widgetName}/widget.js`,
    widgetJSModule: widgetName =>
      `widgets/${widgetName}/widget.js`,
    widgetHTML: widgetName =>
      `/widgets/${widgetName}/widget.html`,
    widgetIcon: widgetName =>
      `/widgets/${widgetName}/icon.png`
  });

  app.config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,
                       $locationProvider, $ocLazyLoadProvider, JSONEditorProvider) {

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

    // this doesn't seem to work, that's why the next snippet does the same
    $urlMatcherFactoryProvider.strictMode(false);

    $urlRouterProvider.when(`/app/${window.appName}`, function ($state) {
      $state.go('page', {href: ''});
    });

    // If url is not in this app URL scope - reload the whole page.
    $urlRouterProvider
      .otherwise(($injector, $location) => {
        $injector.get('$window').location.href = $location.url();
      });

    $stateProvider
      .state('page', {
        url: `/app/${window.appName}/:href`,
        resolve: {
          pageConfig: function ($stateParams, $q, alert, appConfigPromise, appConfig, widgetLoader) {
            pageConfigPromise = appConfigPromise
              .then(() => {
                let pageConfig = appConfig.config.pages[appConfig.pageIndexByHref($stateParams.href)];

                let deferredResult = $q.defer();
                if (!pageConfig || !pageConfig.holders) {
                  deferredResult.resolve(pageConfig);
                  return deferredResult.promise;
                }

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
            return pageConfigPromise;
          }
        },
        templateProvider: function ($http, appUrls, $templateCache) {
          return pageConfigPromise.then((pageConfig) => {
            if (!pageConfig || !pageConfig.template) {
              return "Page not found!";
            }

            let url = appUrls.templateHTML(pageConfig.template);
            return $http.get(url, {cache: $templateCache})
              .then((result) => result.data);
          });
        },
        controller: 'PageCtrl'
      });
  });

  app.factory('widgetTypesPromise', function ($http, appUrls) {
    return $http.get(appUrls.widgetTypes, {cache: true});
  });

  app.factory('templateTypesPromise', function ($http, appUrls) {
    return $http.get(appUrls.templateTypes, {cache: true});
  });

  app.factory('appConfigPromise', function ($q, $window) {
    return $q((resolve) => {
      resolve($window.appConfig);
    });
  });

  app.service('appConfig', function ($http, $state, $stateParams, appConfigPromise,
                                     appUrls, $rootScope, $modal) {
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
        if (newName !== oldName && newName !== undefined) {
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

    this.addNewPage = (page) => {
      this.config.pages.push(page);
    };

    this.addNewPageInModal = () => {
      $modal.open({
        templateUrl: appUrls.pageModalConfigHTML,
        controller: 'PageModalSettingsController',
        backdrop: 'static',
        resolve: {
          templateTypes: function (templateTypesPromise) {
            return templateTypesPromise;
          }
        }
      });
    };

    appConfigPromise.then((data) => {
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
    };
  });

  app.service('widgetManager', function ($modal, APIUser, APIProvider, widgetLoader, appUrls, prompt) {
    this.deleteIthWidgetFromHolder = (holder, index) => {
      let removedWidget = holder.widgets.splice(index, 1)[0];
      let user = new APIUser();
      user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
    };

    this.openWidgetConfigurationDialog = (widget) => {
      let invocation = (new APIUser()).tryInvoke(widget.instanceName, APIProvider.OPEN_CUSTOM_SETTINGS_SLOT);
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
            return (new APIUser()).getScopeByInstanceName(widget.instanceName);
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
      $modal.open({
        templateUrl: appUrls.widgetModalAddNewHTML,
        controller: 'WidgetModalAddNewController',
        backdrop: 'static',
        resolve: {
          widgetTypes: function (widgetTypesPromise) {
            return widgetTypesPromise;
          },
          widgetLoader: function () {
            return widgetLoader;
          },
          holder: function () {
            return holder;
          }
        }
      });
    };
  });

  app.controller('MainCtrl', function ($scope, $location, $cookies,
                                       alert, appConfig) {
    let cnf = $scope.globalConfig = {};

    $scope.appConfig = appConfig;

    $scope.logIn = () => {
      $cookies.redirectToUrl = $location.url();
      $location.url('/auth/google');
    };

    $scope.logOut = () => {
      $cookies.redirectToUrl = $location.url();
      $location.url('/logout');
    };

    $scope.$watch('globalConfig.designMode', () => {
      cnf.debugMode = cnf.debugMode && !cnf.designMode;
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
    };
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
      // this is probably related to touch vs mouse behaviour and underlying json-editor implementation.
      $timeout(() => {
        $modalInstance.close(angular.extend(data, $scope.basicProperties));
      }, 100);
    };

    $scope.cancel = $modalInstance.dismiss.bind($modalInstance);

    $scope.updateData = (value) => {
      data = value;
    };
  });

  app.controller('WidgetModalAddNewController', function ($scope, $modalInstance, widgetTypes,
                                                          widgetLoader, holder, appUrls) {
    // create array instead of map (easy filtering)
    let widgetTypesArr = [];
    let currentWidget;

    for (let type in widgetTypes.data) {
      currentWidget = {};
      currentWidget.type = type;
      currentWidget.description = widgetTypes.data[type].description;

      // add path to icon of a widget
      if (widgetTypes.data[type].noicon) {
        currentWidget.icon = appUrls.defaultWidgetIcon;
      } else {
        currentWidget.icon = appUrls.widgetIcon(currentWidget.type);
      }
      widgetTypesArr.push(currentWidget);
    }

    $scope.widgetTypes = widgetTypesArr;

    $scope.chooseWidget = (widget) => {
      $scope.chosenWidget = widget;
      // no error as a widget was chosen
      $scope.widgetErr = {};
    };

    $scope.add = (widget) => {
      // checks whether chosen template belongs to the current filter criteria
      $scope.chosenWidget = widget;

      let realWidget = {
        type: $scope.chosenWidget.type,
        instanceName: Math.random().toString(36).substring(2)
      };
      widgetLoader.load($scope.chosenWidget.type)
        .then(() => {
          holder.widgets = holder.widgets || [];
          holder.widgets.push(realWidget);
          $timeout(() => widgetManager.openWidgetConfigurationDialog(realWidget));
        }, (error) => {
          console.log('ERROR', error);
          alert.error('Cannot add widget: ' + error);
        });
      $modalInstance.close();
    };

    $scope.isSelected = (widget) => {
      return $scope.chosenWidget === widget;
    };

    $scope.cancel = () => {
      $modalInstance.dismiss();
    };
  });

  app.controller('PageModalSettingsController', function ($scope, $state, $modalInstance, alert,
                                                          appConfig, templateTypes, appUrls) {
    // array of all template types
    let templateTypesArr = [];

    // create templateTypesArr out of templateTypes map
    for (let type in templateTypes.data) {
      let currentTemplate = {};
      currentTemplate.type = type;
      currentTemplate.description = templateTypes.data[type].description;
      currentTemplate.holders = templateTypes.data[type].holders;
      currentTemplate.icon = appUrls.templateIcon(currentTemplate.type);

      templateTypesArr.push(currentTemplate);
    }

    // check whether shortTitle is correct (isn't empty for now)
    $scope.checkShortTitle = (shortTitle) => {
      $scope.titleErr = {};
      if (!shortTitle) {
        $scope.titleErr.message = 'field mustn\'t be empty';
        $scope.titleErr.class = 'red';
      }
    };

    // check whether href is correct (isn't empty for now)
    $scope.checkHref = (href) => {
      $scope.hrefErr = {};
      if (!href) {
        $scope.hrefErr.message = 'field mustn\'t be empty';
        $scope.hrefErr.class = 'red';
      }
    };

    $scope.templateTypes = templateTypesArr;

    // add button action
    $scope.add = (shortTitle, href, filteredTemplates) => {
      let hasHrefAndTitle = href && shortTitle;

      if (!hasHrefAndTitle) {
        $scope.checkHref(href);
        $scope.checkShortTitle(shortTitle);
      }

      // checks whether chosen template belongs to the current filter criteria
      let inFilter = false;

      for (let i = 0; i < filteredTemplates.length; i++) {
        if (filteredTemplates[i] === $scope.chosenTemplate) {
          inFilter = true;
          break;
        }
      }

      // if chosen template isn't in the current filter then show an error
      if (!inFilter) {
        $scope.chosenTemplate = {};
        $scope.templateErr = {};
        $scope.templateErr.message = 'choose a template';
        $scope.templateErr.class = 'red';
      }

      if (!hasHrefAndTitle || !inFilter) {
        return;
      }

      let page = {};
      page.shortTitle = shortTitle;
      page.href = href;

      page.template = $scope.chosenTemplate.type;
      page.holders = {};
      for (let holderName of $scope.chosenTemplate.holders) {
        page.holders[holderName] = {
          widgets: []
        };
      }

      appConfig.addNewPage(page);

      // redirect to the new page
      $state.go('page', {href: href});
      $modalInstance.close();
    };

    $scope.chooseTemplate = (template) => {
      $scope.chosenTemplate = template;
      // don't show any error message
      $scope.templateErr = {};
    };

    $scope.cancel = () => {
      $modalInstance.dismiss();
    };

    $scope.isSelected = (template) => {
      return $scope.chosenTemplate === template;
    };
  });

  return angular.bootstrap(document, ['app'], {
    strictDi: false
  });
});
