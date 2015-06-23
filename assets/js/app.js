// Bower modules
import angular from 'angular';
import 'angular-animate';
import 'angular-cookies';
import 'angular-foundation';
import 'angular-json-editor';
import 'angular-oclazyload';
import 'angular-ui-router';
import 'angular-ui-tree';
import 'file-upload';
import 'ngstorage';
import 'sceditor';
import 'template-cached-pages';
// Our modules
import 'app-config';
import 'author';
import 'i18n';
import 'info';
import 'modal-controllers';
import 'skin-directives'
import 'user';
import 'widget-api';

const app = angular.module('app', ['ui.router', 'ngStorage', 'ngAnimate', 'oc.lazyLoad', 'mm.foundation',
  'ngCookies', 'angular-json-editor', 'ui.tree',
  'app.templates',
  'app.widgetApi', 'app.config', 'app.i18n', 'app.skinDirectives',
  'app.user', 'app.info', 'app.author', 'app.modals']);

app.factory('appUrls', function (appId) {
  return {
    api: {
      createApp: (appName, skinName = 'default') =>
        `/api/app/create/${appName}?skinName=${skinName}`,
      destroy: appId => `/api/app/destroy/${appId}`,
      'import': '/api/app/import',
      rename: (appId, newAppName) => `/api/app/rename/${appId}/${newAppName}/`
    },
    app: (appName, page) => `/app/${appName}/${page || ''}`,
    appConfig: `/api/app/config/${appId}`,
    appList: '/api/app/get-list',
    googleAuth: `/auth/google`,
    logout: `/logout`,
    usersList: `/api/users/list`,
    templateTypes: '/templates/templates.json',
    widgetTypes: '/widgets/widgets.json',
    shareSettingsHTML: '/partials/share-settings.html',
    appSettingsHTML: '/partials/app-settings.html',
    widgetHolderHTML: '/partials/widget-holder.html',
    widgetModalConfigHTML: '/partials/widget-modal-config.html',
    widgetModalAddNewHTML: '/partials/widget-modal-add-new.html',
    defaultWidgetIcon: '/widgets/default_widgets_icon.png',
    skinUrl: skinName =>
      `/skins/${skinName}.html`,
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

app.constant('homePageAppName', 'app-list');

app.constant('globalConfig', {
  designMode: false,
  debugMode: false
});

app.constant('appSkins', [
  {
    name: "default",
    title: "Default"
  }
]);

app.constant('randomWidgetName', () => Math.random().toString(36).substring(2));

app.config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,
                     $locationProvider, $ocLazyLoadProvider, JSONEditorProvider,
                     appName, homePageAppName) {

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

  const pageConfig = ($q, alert, app) => {
    const pageConfig = app.pageConfig();

    if (!pageConfig || !pageConfig.holders) {
      return pageConfig;
    }

    const widgetTypes = [];
    for (let holderName in pageConfig.holders) {
      if (pageConfig.holders.hasOwnProperty(holderName)) {
        for (let widget of pageConfig.holders[holderName].widgets) {
          widgetTypes.push(widget.type);
        }
      }
    }
    return pageConfig;
  };

  const templateProvider = ($http, $templateCache, appUrls, app) => {
    const pageConfig = app.pageConfig();
    if (!pageConfig || !pageConfig.template) {
      return "Page not found!";
    }

    const url = appUrls.templateHTML(pageConfig.template);
    return $http.get(url, {cache: $templateCache})
      .then(result => result.data);
  }

  $stateProvider
    .state('page', {
      url: appName !== homePageAppName ? `/app/${appName}/:href` : '/:href',
      resolve: {
        pageConfig
      },
      templateProvider,
      controller: 'PageController'
    });
});

app.factory('fullReload', function ($window) {
  return (url) => $window.location.href = url;
})

app.factory('widgetTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.widgetTypes, {cache: true});
});

app.factory('templateTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.templateTypes, {cache: true});
});

app.factory('config', function (initialConfig, $log) {
  if (initialConfig.pages.length <= 1) {
    $log.info('When there is no 404 page you might have problems with page routing!');
  }
  return angular.copy(initialConfig);
});

app.service('app', function ($http, $state, $stateParams, $log, config, $rootScope, $modal,
                             $translate, appUrls, appName, fullReload, confirm) {

  let pageConf;

  angular.extend(this, {
    sendingToServer: false,
    wasModified: false,
    wasSavedEver: false,
    currentPageIndex: 0,

    isHomePageOpened() {
      return $stateParams.href === '';
    },

    is404PageOpened() {
      return this.pageConfig().href === '404';
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

      $log.warn("app.pageIndexByHref can't find page!");
    },
    pageConfig() {
      return pageConf;
    },

    markModified() {
      this.wasModified = true;
    },

    deletePage(page) {
      const curPageHref = $stateParams.href;
      const index = config.pages.indexOf(page);
      const deletedPageHref = config.pages[index].href;
      if (angular.isDefined(config.pages) && angular.isDefined(config.pages[index])) {
        config.pages.splice(index, 1);
        this.markModified(true);

        if (curPageHref === deletedPageHref) {
          $state.go('page', {href: ''});
        }
      }
    },

    submitToServer(callback) {
      this.sendingToServer = true;
      return $http.put(appUrls.appConfig, config)
        .then(() => {
          this.wasSavedEver = true;
          this.sendingToServer = false;
          this.wasModified = false;

          if (config.name !== appName) {
            fullReload(appUrls.app(config.name, $stateParams.href));
          }
        }, (data) => {
          this.sendingToServer = false;
          if (callback) {
            callback(data);
          }
        });
    },

    addNewPage(page) {
      page.holders = page.holders || {};
      config.pages.push(page);
    },

    openShareSettings() {
      $modal.open({
        templateUrl: appUrls.shareSettingsHTML,
        controller: 'ShareSettingsModalController',
        windowClass: 'share-settings-modal',
        backdrop: 'static'
      }).result.then((collaborations) => {
        config.collaborations = collaborations;
          this.markModified(true);
      });
    },

    openAppSettingsDialog() {
      $modal.open({
        templateUrl: appUrls.appSettingsHTML,
        controller: 'AppSettingsModalController',
        backdrop: 'static'
      }).result.then((newSettings) => {
        angular.extend(config, newSettings);
        this.markModified(true);
      });
    },

    onStateChangeStart(evt, toState, toParams) {
      if (toState.name === 'page') {
        const pageIndex = this.pageIndexByHref(toParams.href);
        pageConf = config.pages[pageIndex];
        this.currentPageIndex = pageIndex;
      } else {
        $log.warn('No config available - non-page routing...');
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

app.service('widgetManager', function ($modal, $timeout, APIUser, APIProvider,
                                       appUrls, app, randomWidgetName) {
  angular.extend(this, {
    deleteIthWidgetFromHolder(holder, index) {
      const removedWidget = holder.widgets.splice(index, 1)[0];
      const user = new APIUser();
      user.tryInvoke(removedWidget.instanceName, APIProvider.REMOVAL_SLOT);
      app.markModified(true);
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
          app.markModified(true);
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
          holder() {
            return holder;
          }
        }
      }).result
        .then(widgetType => {
          const realWidget = {
            type: widgetType,
            instanceName: randomWidgetName()
          };

          holder.widgets = holder.widgets || [];
          holder.widgets.push(realWidget);
          $timeout(() => this.openWidgetConfigurationDialog(realWidget));
        });
    },

    cloneWidget(holder, widget){
      const newWidget = angular.copy(widget);
      newWidget.instanceName = randomWidgetName();
      holder.widgets.push(newWidget);
      app.markModified(true);
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

app.controller('MainController', function ($scope, $location, $cookies, $window, $translate,
                                           alert, app, config, user, appUrls, globalConfig,
                                           fullReload) {
  angular.extend($scope, {
    globalConfig,
    app,
    config,
    user,

    skin: {
      url: appUrls.skinUrl(config.skinName || 'default')
    },

    logIn() {
      $cookies.put('redirectToUrl', $location.url());
      fullReload(appUrls.googleAuth);
    },

    logOut() {
      $cookies.put('redirectToUrl', $location.url());
      fullReload(appUrls.logout);
    },

    alertAppConfigSubmissionFailed(data) {
      $translate('ERROR_SUBMITTING_APP_CONF', data).then(translation =>
        alert.error(translation)
      );
    }
  });

  $scope.$watchCollection('config.pages', (newPages, oldPages) => {
    if (oldPages !== newPages) {
      app.markModified();
    }
  });

  $scope.$watch('globalConfig.designMode', () => {
    const cnf = $scope.globalConfig;
    cnf.debugMode = cnf.debugMode && !cnf.designMode;
  });

  $window.onbeforeunload = (evt) => {
    const message = $translate.instant('LEAVE_WEBSITE_WITHOUT_SAVING')
    if (app.wasModified) {
      if (typeof evt === "undefined") {
        evt = $window.event;
      }
      if (evt) {
        evt.returnValue = message;
      }
      return message;
    }
  };
});

app.controller('PageController', function ($scope, pageConfig) {
  angular.extend($scope, {
    config: pageConfig
  });
});

app.directive('widgetHolder', function (appUrls, widgetManager) {
  return {
    restrict: 'E',
    templateUrl: appUrls.widgetHolderHTML,
    transclude: true,
    scope: true,
    link(scope, element, attrs) {
      scope.$watchCollection('scope.config.holders', () => {
        if (scope.config.holders) {
          scope.holder = scope.config.holders[attrs.name] || {};
          scope.holder.width = angular.element(element[0]).width();
        }
      });

      angular.extend(scope, {
        deleteIthWidgetFromHolder: widgetManager.deleteIthWidgetFromHolder.bind(widgetManager),
        addNewWidgetToHolder: widgetManager.addNewWidgetToHolder.bind(widgetManager),
        cloneWidget: widgetManager.cloneWidget.bind(widgetManager)
      });
    }
  };
});

app.directive('widget', function ($rootScope, appUrls, globalConfig, widgetLoader,
                                  widgetManager, user, app, randomWidgetName) {
  function updateEventsOnNameChange(widget) {
    $rootScope.$watch(() => widget.instanceName, (newName, oldName) => {
      if (newName !== oldName && newName !== undefined) {
        const subscriptions = app.pageConfig().subscriptions;
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
  }

  return {
    restrict: 'E',
    templateUrl: '/partials/widget.html',
    transclude: true,
    scope: {
      type: '@',
      widget: '=config',
      onDelete: '&',
      onClone: '&'
    },
    link(scope, element, attrs) {
      scope.widget = scope.widget || {};
      scope.widget.type = scope.widget.type || scope.type;
      scope.widget.instanceName =
        attrs.instanceName || scope.widget.instanceName || randomWidgetName();

      updateEventsOnNameChange(scope.widget);

      widgetLoader.load(scope.type).then(() => scope.widgetCodeLoaded = true);

      angular.extend(scope, {
        globalConfig,
        user,
        widgetTemplateUrl: appUrls.widgetHTML(scope.type),
        widgetCodeLoaded: false,
        widgetPanel: {
          allowDeleting: !!attrs.onDelete,
          allowCloning: !!attrs.onClone,
          allowConfiguring: angular.isUndefined(attrs.nonConfigurable),
          editingInstanceName: false,
          openWidgetConfigurationDialog: widgetManager.openWidgetConfigurationDialog.bind(widgetManager),
          startEditingInstanceName() {
            scope.widgetPanel.editingInstanceName = true;
            scope.widgetPanel.newInstanceName = scope.widget.instanceName;
          },
          finishEditingInstanceName() {
            scope.widgetPanel.editingInstanceName = false;
            if (scope.widget.instanceName !== scope.widgetPanel.newInstanceName) {
              scope.widget.instanceName = scope.widgetPanel.newInstanceName;
              app.markModified();
            }
          },
          cancelEditingInstanceName() {
            scope.widgetPanel.editingInstanceName = false;
          },
          deleteWidget() {
            scope.onDelete();
          },

          cloneWidget() {
            scope.onClone();
          }
        }
      })
    }
  };
});

angular.bootstrap(document, ['app'], {
  strictDi: false
});
