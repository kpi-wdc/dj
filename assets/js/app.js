// Bower modules

import angular from 'angular';
import 'angular-animate';
import 'angular-cookies';
import 'angular-foundation';
import 'angular-json-editor';
import 'angular-oclazyload';
import 'angular-ui-router';
import 'angular-ui-tree';
import 'angular-clipboard';
import 'angular-hotkeys';
import 'angular-scroll';
import 'ngReact';


import 'file-upload';
import 'ngstorage';
import 'sceditor';
import 'template-cached-pages';
// Our modules
import 'app-config';
import 'author';
import 'i18n';
import 'dps';
import 'skins'
import 'dictionary';
import 'info';
import 'modal-controllers';
import 'skin-directives'
import 'user';
import 'widget-api';




const app = angular.module('app', ['ui.router', 'ngStorage', 'ngAnimate', 'oc.lazyLoad', 'mm.foundation',
  'ngCookies', 'angular-json-editor', 'ui.tree','angular-clipboard','cfp.hotkeys',
  'app.templates', 'react', 'duScroll',
  'app.widgetApi', 'app.config', 'app.i18n','app.dps', 'app.skins','app.skinDirectives',
  'app.user', 'app.info', 'app.author', 'app.modals','app.dictionary']);

app.constant("portal", {
        api:{
          setConfig: "/api/app/config/set",
          getConfig:"/api/app/config/get"
        }
});        

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
    setAdmin: '/api/admin/set',
    createTimeline: '/api/timeline/upload',
    templateTypes: '/templates/templates.json',
    widgetTypes: '/widgets/widgets.json',
    shareSettingsHTML: '/partials/share-settings.html',
    appSettingsHTML: '/partials/app-settings.html',
    resourceManagerHTML:'/partials/resource-manager.html',
    pageManagerHTML: '/partials/page-manager.html',
    translationManagerHTML:'/partials/translation-manager.html',
    widgetHolderHTML: '/partials/widget-holder.html',
    widgetModalConfigHTML: '/partials/widget-modal-config.html',
    widgetModalAddNewHTML: '/partials/widget-modal-add-new.html',
    viewPageConfigHTML : '/partials/view-page-config.html',
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
      `/widgets/${widgetName}/icon.png`,
    widgetHelp: (type, lang) =>
      `/help/widget/${type}/${lang}`
  };
});

// app.constant('homePageAppName', defaultApp);

app.constant('globalConfig', {
  designMode: false,
  debugMode: false
});

app.constant('selectedHolder',null);

// app.constant('appSkins', [
//   {
//     name: "default",
//     title: "Default"
//   }
// ]);

// app.factory("appSkins", function($http){
//  var list = [];
//  if(list.length == 0){
//       $http
//       .get("./api/app/skins")
//       .then(function(resp){
        
//         list = resp.data.map((item) => {return {title:item, name:item}});
//         console.log("Skins", list)
//       })
//  }
//  return list; 
// })

app.constant('randomWidgetName', () => Math.random().toString(36).substring(2));

app.value('duScrollDuration', 500)
app.value('duScrollOffset', 50)
app.value('duScrollEasing', function (t) { return 1+(--t)*t*t*t*t })

app.service("$scroll",function($document,APIUser){
  return function(scope){
    if(!scope.widget){
      scope = (new APIUser()).getScopeByInstanceName(scope)
    }
    
    if(scope){
      var element = scope.container.getElement()[0].children[0];
      $document.scrollToElementAnimated(element);
    }
  }
})

app.config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider,
                     $locationProvider, $ocLazyLoadProvider, //$ViewScrollProvider,
                     JSONEditorProvider, appName, defaultApp) {

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
  // $ViewScrollProvider.useAnchorScroll();

  // this doesn't seem to work, that's why the next snippet does the same
  $urlMatcherFactoryProvider.strictMode(false);

  $urlRouterProvider.when(`/app/${appName}`, ($state) => {
    console.log("WHEN state", $state)
    $state.go('page', {href: ''});
  });

  // If url is not in this app URL scope - reload the whole page.
  $urlRouterProvider
    .otherwise(($injector, $location) => {
      console.log("otherwise location", $location)
      $injector.get('$window').location.href = $location.url();
    });

  const pageConfig = ($q, alert, app, widgetLoader) => {
    return $q((resolve, reject) => {
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
  };

  const templateProvider = ($http, $templateCache, appUrls, app) => {
    const pageConfig = app.pageConfig();
    if (!pageConfig || !pageConfig.template) {
      return "Page not found!";
    }

    const url = appUrls.templateHTML(pageConfig.template);
    return $http.get(url, {cache: $templateCache})
      .then((result) => {
        return result.data
      });
  };

  $stateProvider
    .state('page', {
      url: appName !== defaultApp ? `/app/${appName}/:href` : '/:href',
      resolve: {
        pageConfig
      },
      templateProvider,
      controller: 'PageController'
    });
});

app.factory('fullReload', function ($window) {
  return (url) => $window.location.href = url;
});

app.factory('selectHolder', function (selectedHolder) {
  return (holderScope) => {
    // console.log("Selected holder", selectedHolder, "Event Holder", holderScope)
    if(selectedHolder && selectedHolder != null){
      selectedHolder.acceptDrop = ""; 
    }
    selectedHolder = holderScope;
    if(selectedHolder && selectedHolder != null){
      selectedHolder.acceptDrop = "accept-drop"; 
    }
  };
});


app.factory('widgetTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.widgetTypes, {cache: true});
});

app.factory('templateTypesPromise', function ($http, appUrls) {
  return $http.get(appUrls.templateTypes, {cache: true});
});



app.factory('config', function (initialConfig, $log, templateTypesPromise) {
  if (initialConfig.pages.length <= 1) {
    $log.info('When there is no 404 page you might have problems with page routing!');
  }

  // console.log("GET CONFIG")
  // templateTypesPromise.then((resp) => {
  //   var pageTemplates = resp.data;
  //   var pages = initialConfig.pages
  //   pages.forEach((page) => {
  //     var pageTemplate = pageTemplates[page.template];
  //     pageTemplate.holders.forEach((holder) => {
  //       if(!page.holders[holder]){
  //         page.holders[holder] = {widgets:[]}
  //       }
  //     })
  //   })
  // })
  // console.log("UPDATED CONFIG", initialConfig)
  
  var c = angular.copy(initialConfig);

  //c.dps="https://dj-app.herokuapp.com"; 
  return c;
});

app.factory('appHotkeysInfo', ['config', (config) => {
  return {
    title:"Application Hotkeys",
    icon: config.icon,
    sections:[
      { 
        fields:[{key:"Alt + H",value:"Show this help"},
                {key:"Esc",value:"Close"},
                {key:"Alt + D",value:"Switch Mode"},
                {key:"Alt + P",value:"Activate Page Manager"},
                {key:"Alt + T",value:"Activate Translation Manager"},
                {key:"Alt + R",value:"Activate Resource Manager"},
                {key:"Alt + S",value:"Save Settings"},
                {key:"Alt + C",value:"View Page Config"}
        ]
      }
    ]    
  }
}]);



app.service('app', function ($http, $state, $stateParams, $log, config, $rootScope, $modal,
                             $translate, appUrls, appName, fullReload, eventWires, APIUser, 
                             // APIProvider, 
                             hotkeys, splash, appHotkeysInfo,globalConfig,
                             dialog, portal,templateTypesPromise,
                             initialConfig, clipboard, jsonEditor) {

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
      
      var user = new APIUser();
      user.invokeAll('BEFORE_CHANGE_PAGE_SLOT');
      
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

    clonePage() {
      // console.log("Clone Page", config)
      dialog({
          title:"Clone Page",
          fields:{
            shortName:{
              title:"Short Title",
              type:"text"
            },
            href:{
              title:"Reference",
              type:"text"
            },
            cloned:{
              title:"Cloned page",
              type:"select",
              options: config.pages.map((item) => {return {title:item.shortTitle, value: item}})
            }

          }
        })
        .then((form) => {
            let clone = JSON.parse(form.fields.cloned.value);
            clone.shortTitle = form.fields.shortName.value;
            clone.href = form.fields.href.value;
            config.pages.push(clone);
            $state.go('page', {href: clone.href}, {reload: true});
            this.markModified(true);
        })
    },

    copyPage() {

       dialog({
          title:"Copy Page",
          fields:{
            page:{
              title:"Page",
              type:"select",
              options: config.pages.map((item) => {return {title:item.shortTitle, value: item}})
            }

          }
        })
        .then((form) => {
            let copy = form.fields.page.value;
            clipboard.copyText(copy)
            
        })
    },

    pastePage(){
      let self = this;
      jsonEditor("","Paste and modify page configuration")
      .then(function(json){
        let p = JSON.parse(json);
        config.pages.push(p);
        $state.go('page', {href: p.href}, {reload: true});
        self.markModified(true);
      })
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
        windowClass: 'app-settings-modal',
        backdrop: 'static'
      }).result.then((newSettings) => {
        // console.log(newSettings);
        angular.extend(config, newSettings);
        this.markModified(true);
      });
    },

    openResourceManager() {
      if(!globalConfig.designMode) return;
    	$modal.open({
        templateUrl: appUrls.resourceManagerHTML,
        controller: 'ResourceManagerController',
        backdrop: 'static'
      })
    },

   openTranslationManager() {
      if(!globalConfig.designMode) return;
      $modal.open({
        templateUrl: appUrls.translationManagerHTML,
        controller: 'TranslationManagerController',
        backdrop: 'static'
      })
    },

    openPageManager() {
      if(!globalConfig.designMode) return;
      $modal.open({
        templateUrl: appUrls.pageManagerHTML,
        controller: 'PageManagerController',
        backdrop: 'static'
      })
    },

    openPortalConfigDialog(){
      $http
        .get(portal.api.getConfig)
        .then((resp) => {
          // console.log("Portal Config",resp.data)
          let fields = [];
          for(let key in resp.data){
            fields.push({title:key,value:resp.data[key]})
          }
          dialog({
            title:`${$translate.instant('PORTAL_CONFIGURATION')}`,
            "fields":fields
          }).then((form) => {
            let conf = {};
            form.fields.forEach((item) => {conf[item.title] = item.value})
            $http
              .post(portal.api.setConfig,{config:conf})
              .then(() => {
                splash({
                  title:`${$translate.instant('PORTAL_CONFIGURATION')}`
                    +": "+`${$translate.instant('SAVED')}`
                  },
                  1000  
                )
              })
          })
        })
    },

    openSetAdminDialog(){
      // console.log("openSetAdminDialog")
      $http.get(appUrls.usersList)
      .then((resp) => {
        dialog({
          title:"Set admin grant for user",
          fields:{
            user:{
              title:"User's email",
              type:"typeahead",
              list:resp.data.map((user) => user.email)
            }
          }
        })
        .then((form) => {
          // console.log("User ", form.fields.user.value)
          $http.post(appUrls.setAdmin, {
            email:form.fields.user.value,
            value:true
          }).then((resp) => {
            splash({
                  title:"Grant Admin Role for "+resp.data[0].name+" ("+resp.data[0].email+")"
                  },
                  1000  
                )
          })
        })  
      })
      
    },

    viewPageConfig() {
      if(!globalConfig.designMode) return;
      $modal.open({
        templateUrl: appUrls.viewPageConfigHTML,
        controller: 'ViewPageConfigController',
        backdrop: 'static'
      })
    },


    showHotkeys(){
      splash(appHotkeysInfo)
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
    },

    wireSignalWithSlot(emitterScope, signalName, providerScope, slotName) {
      if (!emitterScope || !providerScope) {
        return;
      }
      const wire = eventWires.get(emitterScope) || [];
      wire.push({signalName, providerScope, slotName});
      eventWires.set(emitterScope, wire);
    },

    pageSubscriptions() {
      const pageConf = this.pageConfig() || {};
      pageConf.subscriptions = pageConf.subscriptions || [];
      
      
      pageConf.subscriptions.addListeners = function(listeners){
        for(let j in listeners){
          let exists = false;
          let listener = listeners[j];
          for (var i in pageConf.subscriptions) {
            if (pageConf.subscriptions[i].emitter === listener.emitter 
              && pageConf.subscriptions[i].receiver === listener.receiver
              && pageConf.subscriptions[i].signal === listener.signal
              && pageConf.subscriptions[i].slot === listener.slot
              ) {
              exists = true;
            }
          }
          if (!exists) { pageConf.subscriptions.push(listener);}
        }
      };

      pageConf.subscriptions.addListener = function(listener){
        pageConf.subscriptions.addListeners([listener]);        
      };


      pageConf.subscriptions.removeListeners = function(listener){
       for (var i in pageConf.subscriptions) {
          if (
            (pageConf.subscriptions[i].emitter === listener.emitter || angular.isUndefined(listener.emitter)) 
            && 
            (pageConf.subscriptions[i].receiver === listener.receiver || angular.isUndefined(listener.receiver))
            && 
            (pageConf.subscriptions[i].signal === listener.signal || angular.isUndefined(listener.signal))
            && 
            (pageConf.subscriptions[i].slot === listener.slot || angular.isUndefined(listener.slot))
            ) {
            pageConf.subscriptions.splice(i, 1);
            return
          }
        }
      };

      return pageConf.subscriptions;
    },

    updatePageSubscriptions() {
      $rootScope.$evalAsync(() => {
        const subscriptions = this.pageSubscriptions();
        eventWires.clear();

        if (!subscriptions) {
          return;
        }
        for (let s of subscriptions) {
          this.wireSignalWithSlot(
            APIUser.getScopeByInstanceName(s.emitter),
            s.signal,
            APIUser.getScopeByInstanceName(s.receiver),
            s.slot);
        }
      });
    }
  });

  pageConf = config.pages[this.pageIndexByHref($stateParams.href || '')];

  $rootScope.$on('$stateChangeStart', this.onStateChangeStart.bind(this));
});


app.service("logIn", function($cookies, $location,fullReload,appUrls){
   return () => {
      $cookies.put('redirectToUrl', $location.url());
      fullReload(appUrls.googleAuth);
    }
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
      }else{
        // console.log("Returns from config dialog", invocation)
        if(invocation.result){
          invocation.result.then(() => {
            const user = new APIUser();
            user.invokeAll(APIProvider.RECONFIG_SLOT);
            app.markModified(true);
            user.invokeAll(APIProvider.PAGE_COMPLETE_SLOT)    
          })
        }
      }
    },


    openDefaultWidgetConfigurationDialog(widget) {
      $modal.open({
        templateUrl: appUrls.widgetModalConfigHTML,
        controller: 'WidgetModalSettingsController',
        windowClass: 'app-settings-modal',
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
          user.invokeAll(APIProvider.PAGE_COMPLETE_SLOT)
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
            type: widgetType.type,
            openConfigOnLoad: true,
            instanceName: randomWidgetName()
          };

          holder.widgets = holder.widgets || [];
          holder.widgets.push(realWidget);
        });
    },

    cloneWidget(holder, widget){
      const newWidget = angular.copy(widget);
      newWidget.instanceName = randomWidgetName();
      console.log("Cloned", widget)
      console.log("Holder", holder)
      var pos = holder.widgets.map(function(item){return item.instanceName}).indexOf(widget.instanceName)
      holder.widgets.splice(pos,0,newWidget)
      // holder.widgets.push(newWidget);
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
                                           fullReload, hotkeys,splash,appHotkeysInfo,
                                           APIProvider, APIUser) {
  
  if(user.isOwner || user.isCollaborator){
    // console.log("Add hotkeys")
    

    hotkeys.add({
      combo: 'alt+h',
      description: 'Show hotkeys',
      callback: function(event) {
        event.preventDefault();
        app.showHotkeys();
      }
    });

    hotkeys.add({
      combo: 'alt+p',
      description: 'Invoke Page Manager',
      callback: function(event) {
        event.preventDefault();
        app.openPageManager();
      }
    });

    hotkeys.add({
      combo: 'alt+r',
      description: 'Invoke Resources Manager',
      callback: function(event) {
        event.preventDefault();
        app.openResourceManager();
      }
    });

    hotkeys.add({
      combo: 'alt+t',
      description: 'Invoke Translations Manager',
      callback: function(event) {
        event.preventDefault();
        app.openTranslationManager();
      }
    });

    hotkeys.add({
      combo: 'alt+d',
      description: 'Switch mode',
      callback: function(event) {
        event.preventDefault();
        globalConfig.designMode = !globalConfig.designMode;
      }
    });

    hotkeys.add({
      combo: 'alt+c',
      description: 'View Page Config',
      callback: function(event) {
        event.preventDefault();
        app.viewPageConfig();
      }
    });

    hotkeys.add({
      combo: 'alt+s',
      description: 'Save settings',
      callback: function(event) {
        event.preventDefault();
        app.submitToServer();
      }
    });
    // console.log(hotkeys);
    splash(appHotkeysInfo,5000);
     // hotkeys.toggleHelp();
  }
  
  angular.extend($scope, {
    globalConfig,
    app,
    config,
    user,

    skin: {
      url: appUrls.skinUrl(config.skinName || 'default')
    },

    logIn() {
      // console.log("LOGIN")
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
    var user = new APIUser();
    if(globalConfig.designMode) {
      user.invokeAll(APIProvider.BEFORE_DESIGN_MODE_SLOT);
    }else{
      user.invokeAll(APIProvider.BEFORE_PRESENTATION_MODE_SLOT);
    }  
   
  });

  $window.onbeforeunload = (evt) => {
    const message = $translate.instant('LEAVE_WEBSITE_WITHOUT_SAVING');
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

app.controller('PageController', function ($scope, pageConfig, templateTypesPromise) {
  // console.log("Init page controller")
  // templateTypesPromise.then((resp) => {
  //   var pageTemplate = resp.data[pageConfig.template];
  //   console.log(pageConfig.template,pageTemplate)
  //   pageTemplate.holders.forEach((holder) => {
  //     if(!pageConfig.holders[holder]){
  //       console.log(holder)
  //       pageConfig.holders[holder] = {widgets:[]}
  //       console.log("append",pageConfig)
  //     }
  //   })
    angular.extend($scope, {
      config: pageConfig
    });  
  // })
});

app.directive('widgetHolder', function (appUrls, widgetManager, app, selectHolder) {
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
        cloneWidget: widgetManager.cloneWidget.bind(widgetManager),
        // collapsed:false,
        treeOptions:{
          dropped:(event)=>{
            event.source.nodeScope.$$childHead.drag = false;
            selectHolder(null);
            app.markModified()
          },
          dragStart:(event)=>{
              event.source.nodeScope.$$childHead.drag = true;
          },
          accept(sourceNodeScope, destNodesScope, destIndex){
            selectHolder(destNodesScope.$treeScope.$parent.$parent);
            // console.log(scope, destNodesScope.$treeScope.$parent.$parent);
            return true;
          }
        }

      });
    }
  };
});

app.directive('widget', function ($rootScope, $translate, $window, appUrls, globalConfig, widgetLoader,
                                  config, widgetManager, user, app, randomWidgetName,
                                  instanceNameToScope, widgetSlots, widgetTypesPromise,
                                  autoWiredSlotsAndEvents, eventWires) {
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
      onClone: '&',
      container: "=?"
    },
    controller() {}, // needed for require: '^widget' to work in widget-translate directive
    link(scope, element, attrs) {
      // console.log("Link", element)
      if (!scope.type) {
        throw "widget directive needs type parameter";
      }

      scope.container = {
          getScope: function(){ return scope; },

          getElement: function(){ return element; }
      }    

      scope.skin = attrs.skin;
      // console.log(scope.type+" "+attrs.instancename+" "+attrs.skin);

      if (!scope.widget && attrs.instancename) {
        config.appWidgets = config.appWidgets || [];
        let conf = config.appWidgets.find(wgt => wgt.instanceName === attrs.instancename);
        if (!conf) {
          conf = {
            instanceName: attrs.instancename,
            type: scope.type,
            container: scope.container
          };
          config.appWidgets.push(conf);
        }
        scope.widget = conf;
        scope.element = element;
        scope.disallowEditInstanceName = true;
      }

      scope.widget = scope.widget || {};
      scope.widget.type = scope.widget.type || scope.type;
      scope.widget.instanceName =
        attrs.instanceName || scope.widget.instanceName || randomWidgetName();

      widgetTypesPromise.then(w => {
        if (w.data[scope.widget.type].noicon !== true) {
          scope.widget.icon = appUrls.widgetIcon(scope.widget.type);
        }
      });

      updateEventsOnNameChange(scope.widget);

      widgetLoader.load(scope.type).then(() => {
        scope.widgetCodeLoaded = true;

        if (scope.widget.openConfigOnLoad) {
          delete scope.widget.openConfigOnLoad;

          scope.$applyAsync(() => {
            widgetManager.openWidgetConfigurationDialog(scope.widget)
          });
        }
      });


      function registerScope(scope) {
        instanceNameToScope.set(scope.widget.instanceName, scope);
        scope.$watch('widget.instanceName', (newName, oldName) => {
          if (newName !== oldName) {
            instanceNameToScope.set(newName, scope);
            instanceNameToScope.delete(oldName);
          }
        });

        widgetSlots.set(scope, []);

        app.updatePageSubscriptions();

        scope.$on('$destroy', () => {
          // clean widgetSlots and eventWires
          widgetSlots.delete(scope);
          eventWires.delete(scope);

          // clean autoWiredSlotsAndEvents
          for (let i = autoWiredSlotsAndEvents.length - 1; i >= 0; --i) {
            if (autoWiredSlotsAndEvents[i].providerScope === scope) {
              autoWiredSlotsAndEvents.splice(i, 1);
            }
          }

          // clean instanceNameToScope
          instanceNameToScope.delete(scope.widget.instanceName);

        });
      }

      registerScope(scope);
       widgetTypesPromise
          .then((widgetTypes) => {
            angular.extend(scope, {
              globalConfig,
              user,
              widgetTemplateUrl: (widgetTypes.data[scope.type].html)
                                  ? widgetTypes.data[scope.type].html
                                  : appUrls.widgetHTML(scope.type),
              widgetCodeLoaded: false,
              widgetPanel: {
                allowDeleting: !!attrs.onDelete,
                allowCloning: !!attrs.onClone,
                allowOpenHelp: true,
                allowConfiguring: angular.isUndefined(attrs.nonConfigurable),
                editingInstanceName: false,
                openWidgetConfigurationDialog: widgetManager.openWidgetConfigurationDialog.bind(widgetManager),
                startEditingInstanceName() {
                  if (scope.disallowEditInstanceName) return;
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
                },

                openHelp() {
                  const url = appUrls.widgetHelp(scope.type, $translate.use());
                  $window.open(url, '_blank');
                }
              }
            })
        })
    }
  };
});

angular.bootstrap(document, ['app'], {
  strictDi: false
});
