import angular from 'angular';
import 'user';
import 'author';
import 'app-config';
import 'widget-api';
import 'info';
import 'angular-ui-router';
import 'ngstorage';
import 'angular-oclazyload';
import 'angular-foundation';
import 'angular-json-editor';
import 'angular-cookies';
import 'template-cached-pages';
import 'sceditor';


const app = angular.module('app', ['ui.router', 'ngStorage', 'oc.lazyLoad', 'mm.foundation',
  'ngCookies', 'angular-json-editor', 'templates',
  'app.widgetApi', 'app.config', 'app.user', 'app.info', 'app.author']);

app.factory('appUrls', function (appId) {
  return {
    appConfig: `/api/app/config/${appId}`,
    templateTypes: '/templates/templates.json',
    widgetTypes: '/widgets/widgets.json',
    appSettingsHTML: '/partials/app-settings.html',
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
      `widgets/${widgetName}/widget`,
    widgetHTML: widgetName =>
      `/widgets/${widgetName}/widget.html`,
    widgetIcon: widgetName =>
      `/widgets/${widgetName}/icon.png`
  };
});

app.config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,
                     $locationProvider, $ocLazyLoadProvider, JSONEditorProvider,
                     appName) {

  $ocLazyLoadProvider.config({
    loadedModules: ['app'],
    asyncLoader: System.amdRequire.bind(System)
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

  $locationProvider.html5Mode(true);

  // this doesn't seem to work, that's why the next snippet does the same
  $urlMatcherFactoryProvider.strictMode(false);

  $urlRouterProvider.when(`/app/${appName}`, ($state) => {
    $state.go('page', {href: ''});
  });

  // If url is not in this app URL scope - reload the whole page.
  $urlRouterProvider
    .otherwise(($injector, $location) => {
      $injector.get('$window').location.href = $location.url();
    });

  $stateProvider
    .state('page', {
      url: `/app/${appName}/:href`,
      resolve: {
        pageConfig($stateParams, $q, alert, app, widgetLoader) {
          return $q(function (resolve, reject) {
            const pageConfig = app.pageConfig();

            if (!pageConfig || !pageConfig.holders) {
              resolve(pageConfig);
              return;
            }

            const widgetTypes = [];
            for (let holderName in pageConfig.holders) {
              if (pageConfig.holders.hasOwnProperty(holderName)) {
                for (let widget of pageConfig.holders[holderName].widgets) {
                  widgetTypes.push(widget.type);
                  app.updateEventsOnNameChange(widget);
                }
              }
            }
            widgetLoader.load(widgetTypes).then(() => {
              resolve(pageConfig);
            }, (err) => {
              alert.error(`Error loading widget controllers. <br><br> ${err}`);
              reject(err);
            });
          });
        }
      },
      templateProvider($http, $templateCache, appUrls, app) {
        const pageConfig = app.pageConfig();
        if (!pageConfig || !pageConfig.template) {
          return "Page not found!";
        }

        const url = appUrls.templateHTML(pageConfig.template);
        return $http.get(url, {cache: $templateCache})
          .then((result) => result.data);
      },
      controller: 'PageController'
    });
});

app.factory('widgetTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.widgetTypes, {cache: true});
});

app.factory('templateTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.templateTypes, {cache: true});
});

app.factory('config', function (initialConfig) {
  if (initialConfig.pages.length <= 1) {
    console.log('When there is no 404 page you might have problems with page routing!');
  }
  return angular.copy(initialConfig);
});

app.service('app', function ($http, $state, $stateParams, config,
                                   appUrls, $rootScope, $modal) {

  let pageConf;

  angular.extend(this, {
    sendingToServer: false,
    wasModified: true,

    isHomePageOpened() {
      return $stateParams.href === '';
    },

    is404PageOpened() {
      return config.pages.indexOf($stateParams.href) === -1;
    },

    pageIndexByHref(href) {
      let result = config.pages.findIndex(p => p.href === href);
      if (result !== -1) {
        return result;
      }
      result = config.pages.findIndex(p => p.href === '404');
      if (result !== -1) {
        return result;
      }

      console.log("app.pageIndexByHref can't find page!");
      return;
    },
    pageConfig() {
      return pageConf;
    },

    deletePage(index) {
      if (angular.isDefined(config.pages) && angular.isDefined(config.pages[index])) {
        config.pages.splice(index, 1);
      }
      $state.go('page', {href: ''});
    },

    submitToServer(callback) {
      this.sendingToServer = true;
      return $http.put(appUrls.appConfig, config)
        .then(() => {
          this.sendingToServer = false;
        }, (data) => {
          this.sendingToServer = false;
          if (callback) {
            callback(data);
          }
        });
    },

    updateEventsOnNameChange(widget) {
      $rootScope.$watch(() => {
        return widget.instanceName;
      }, (newName, oldName) => {
        if (newName !== oldName && newName !== undefined) {
          const subscriptions = this.pageConfig().subscriptions;
          for (let i = 0; i < (subscriptions ? subscriptions.length : 0); i++) {
            const subscription = subscriptions[i];
            if (subscription.emitter === oldName) {
              subscription.emitter = newName;
            }

            if (subscription.receiver === oldName) {
              subscription.receiver = newName;
            }
          }
        }
      });
    },

    addNewPage(page) {
      page.holders = page.holders || {};
      config.pages.push(page);
    },

    addNewPageInModal() {
      $modal.open({
        templateUrl: appUrls.pageModalConfigHTML,
        controller: 'PageModalSettingsController',
        backdrop: 'static',
        resolve: {
          templateTypes(templateTypesPromise) {
            return templateTypesPromise;
          }
        }
      });
    },

    openAppSettingsDialog() {
      $modal.open({
        templateUrl: appUrls.appSettingsHTML,
        controller: 'AppSettingsModalController',
        backdrop: 'static'
      }).result.then((newSettings) => {
        angular.extend(config, newSettings);
      });
    },

    onStateChangeStart(evt, toState, toParams) {
      if (toState.name === 'page') {
        pageConf = config.pages[this.pageIndexByHref(toParams.href)];
      } else {
        console.log('No config available - non-page routing...');
        pageConf = undefined;
      }
    }
  });

  pageConf = config.pages[this.pageIndexByHref($stateParams.href || '')];

  $rootScope.$on('$stateChangeStart', this.onStateChangeStart.bind(this));
});

app.service('widgetLoader', function ($q, $ocLazyLoad, widgetTypesPromise, appUrls) {
  this.load = (widgets) => {
    widgets = angular.isArray(widgets) ? widgets : [widgets];
    return widgetTypesPromise.then((widgetTypesHTTP) => {
      const widgetControllers = [];
      for (let widget of widgets) {
        const widgetType = widgetTypesHTTP.data[widget];
        if (angular.isUndefined(widgetType)) {
          return $q.reject(`Widget "${widget}" doesn't exist!`);
        }
        if (!widgetType.nojs) {
          widgetControllers.push({
            name: `app.widgets.${widget}`,
            files: [appUrls.widgetJSModule(widget)]
          });
        }
      }
      return $ocLazyLoad.load(widgetControllers);
    });
  };
});

app.service('widgetManager', function ($modal, APIUser, APIProvider, widgetLoader, appUrls) {
  angular.extend(this, {
    deleteIthWidgetFromHolder(holder, index) {
      const removedWidget = holder.widgets.splice(index, 1)[0];
      const user = new APIUser();
      user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
    },

    openWidgetConfigurationDialog(widget) {
      const invocation = (new APIUser()).tryInvoke(widget.instanceName, APIProvider.OPEN_CUSTOM_SETTINGS_SLOT);
      if (!invocation.success) {
        this.openDefaultWidgetConfigurationDialog(widget);
      }
    },

    openDefaultWidgetConfigurationDialog(widget) {
      $modal.open({
        templateUrl: appUrls.widgetModalConfigHTML,
        controller: 'WidgetModalSettingsController',
        backdrop: 'static',
        resolve: {
          widgetScope() {
            return (new APIUser()).getScopeByInstanceName(widget.instanceName);
          },
          widgetConfig() {
            return widget;
          },
          widgetType(widgetTypesPromise) {
            return widgetTypesPromise.then((widgetTypesHTTP) =>
                widgetTypesHTTP.data[widget.type]
            );
          }
        }
      }).result.then((newWidgetConfig) => {
          angular.copy(newWidgetConfig, widget);
          const user = new APIUser();
          user.invokeAll(APIProvider.RECONFIG_SLOT);
        });
    },

    addNewWidgetToHolder(holder) {
      $modal.open({
        templateUrl: appUrls.widgetModalAddNewHTML,
        controller: 'WidgetModalAddNewController',
        backdrop: 'static',
        resolve: {
          widgetTypes(widgetTypesPromise) {
            return widgetTypesPromise;
          },
          widgetLoader() {
            return widgetLoader;
          },
          holder() {
            return holder;
          }
        }
      });
    }
  });
});

app.controller('MetaInfoController', function ($scope, $rootScope, appName, app, config, author) {
  angular.extend($scope, {
    title: appName,
    author: author.name,
    config
  });

  $rootScope.$on('$stateChangeSuccess', () => {
    const pageName = app.pageConfig().shortTitle;
    $scope.title = `${pageName} - ${config.title}`;
  });
});

app.controller('MainController', function ($scope, $location, $cookies,
                                           alert, app, config) {
  angular.extend($scope, {
    globalConfig: {},
    app,
    config,

    logIn() {
      $cookies.redirectToUrl = $location.url();
      $location.url('/auth/google');
    },

    logOut() {
      $cookies.redirectToUrl = $location.url();
      $location.url('/logout');
    },

    alertAppConfigSubmissionFailed(data) {
      alert.error(`Error submitting application configuration!<br>
        HTTP error ${data.status}: ${data.statusText}`);
    }
  });

  $scope.$watch('globalConfig.designMode', () => {
    let cnf = $scope.globalConfig;
    cnf.debugMode = cnf.debugMode && !cnf.designMode;
  });
});

app.controller('PageController', function ($scope, pageConfig, widgetManager) {
  angular.extend($scope, {
    config: pageConfig,
    deleteIthWidgetFromHolder: widgetManager.deleteIthWidgetFromHolder.bind(widgetManager),
    openWidgetConfigurationDialog: widgetManager.openWidgetConfigurationDialog.bind(widgetManager),
    addNewWidgetToHolder: widgetManager.addNewWidgetToHolder.bind(widgetManager)
  });
});

app.directive('widgetHolder', function (appUrls) {
  return {
    restrict: 'E',
    templateUrl: appUrls.widgetHolderHTML,
    transclude: true,
    scope: true,
    link(scope, element, attrs) {
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
  let data = angular.copy(widgetConfig);

  // split widgetConfig into basicProperties (not available in json-editor)
  // and data - everything else, modifiable in json-editor
  delete data.instanceName;
  delete data.type;

  angular.extend($scope, {
    widgetScope,
    widgetType,
    widgetConfig: data,

    basicProperties: {
      type: widgetConfig.type,
      instanceName: widgetConfig.instanceName
    },

    ok() {
      // Use $timeout as a fix for android
      // On mobile devices (at least android) `data` is updated AFTER `ng-click` event happens if
      // submit button is pressed while input fields are still focused.
      // this is probably related to touch vs mouse behaviour and underlying json-editor implementation.
      $timeout(() => {
        $modalInstance.close(angular.extend(data, $scope.basicProperties));
      }, 100);
    },

    cancel() {
      $modalInstance.dismiss.bind($modalInstance);
    },

    updateData(value) {
      data = value;
    }
  });
});

app.controller('WidgetModalAddNewController', function ($scope, $modalInstance, widgetTypes,
                                                        widgetLoader, holder, appUrls,
                                                        $timeout, widgetManager) {
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

  angular.extend($scope, {
    widgetTypes: widgetTypesArr,
    chooseWidget(widget) {
      $scope.chosenWidget = widget;
      // no error as a widget was chosen
      $scope.widgetErr = {};
    },

    add(widget) {
      // checks whether chosen template belongs to the current filter criteria
      $scope.chosenWidget = widget;

      const realWidget = {
        type: $scope.chosenWidget.type,
        instanceName: Math.random().toString(36).substring(2)
      };
      widgetLoader.load($scope.chosenWidget.type)
        .then(() => {
          holder.widgets = holder.widgets || [];
          holder.widgets.push(realWidget);
          $timeout(() => widgetManager.openWidgetConfigurationDialog(realWidget));
        }, (error) => {
          alert.error('Cannot add widget: ${error}');
        });
      $modalInstance.close();
    },

    isSelected(widget) {
      $scope.chosenWidget === widget
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

app.controller('PageModalSettingsController', function ($scope, $state, $modalInstance, alert,
                                                        app, templateTypes, appUrls) {

  // array of all template types
  const templateTypesArr = [];

  // create templateTypesArr out of templateTypes map
  for (let type in templateTypes.data) {
    const currentTemplate = {
      type,
      description: templateTypes.data[type].description,
      holders: templateTypes.data[type].holders,
      icon: appUrls.templateIcon(type)
    };

    templateTypesArr.push(currentTemplate);
  }

  angular.extend($scope, {

    href: "",

    // check whether shortTitle is correct (isn't empty for now)
    checkShortTitle(shortTitle) {
      $scope.titleErr = {};
      if (!shortTitle) {
        $scope.titleErr.message = 'field mustn\'t be empty';
        $scope.titleErr.class = 'red';
      }
    },

    // check whether href is correct (isn't empty for now)
    checkHref(href) {
      $scope.hrefErr = {};
      //if (!href) {
      //  $scope.hrefErr.message = 'field mustn\'t be empty';
      //  $scope.hrefErr.class = 'red';
      //}
    },

    templateTypes: templateTypesArr,

    // add button action
    add(shortTitle, href, filteredTemplates) {
      $scope.checkHref(href);
      $scope.checkShortTitle(shortTitle);

      // checks whether chosen template belongs to the current filter criteria
      let inFilter = false;

      for (let template of filteredTemplates) {
        if (template === $scope.chosenTemplate) {
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
        return;
      }

      const page = {
        shortTitle: shortTitle,
        href,
        template: $scope.chosenTemplate.type,
        holders: {}
      };

      for (let holderName of $scope.chosenTemplate.holders) {
        page.holders[holderName] = {
          widgets: []
        };
      }

      app.addNewPage(page);

      // redirect to the new page
      $state.go('page', {href}, {reload: true});
      $modalInstance.close();
    },

    chooseTemplate(template) {
      $scope.chosenTemplate = template;
      // don't show any error message
      $scope.templateErr = {};
    },

    cancel() {
      $modalInstance.dismiss();
    },

    isSelected(template) {
      $scope.chosenTemplate === template;
    }
  });
});

app.controller('AppSettingsModalController', function ($scope, $injector, $modalInstance, appName, config) {
  angular.extend($scope, {
    settings: {
      isPublished: config.isPublished,
      name: config.name,
      keywords: config.keywords,
      title: config.title,
      description: config.description
    },

    ok() {
      $modalInstance.close(this.settings);
    },

    cancel() {
      $modalInstance.dismiss();
    }
  });
});

angular.bootstrap(document, ['app'], {
  strictDi: false
});
