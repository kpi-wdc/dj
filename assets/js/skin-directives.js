import angular from 'angular';

const skin = angular.module('app.skinDirectives', []);

skin.directive('designPanel', () => {
  return {
    restrict: 'E',
    templateUrl: '/partials/design-panel.html',
    require: '^MainController'
  }
});

skin.directive('applicationView', () => {
  return {
    restrict: 'E',
    templateUrl: '/partials/application-view.html',
    transclude: true
  }
});

skin.directive('pageListNav', (app, appName, config, globalConfig) => {
  // TODO: synchronize css styles on active link after clicking
  return {
    restrict: 'E',
    templateUrl: '/partials/page-list-nav.html',
    controller($scope) {
      angular.extend($scope, {
        appName,
        config,
        globalConfig,
        app
      });
    }
  }
});

skin.directive('languageSelectorNav', ($translate) => {
  return {
    restrict: 'E',
    templateUrl: '/partials/language-selector-nav.html',
    scope: {
      "showFlags": "="
    },
    controller($scope) {
      angular.extend($scope, {
        selectLanguage(langKey) {
          $translate.use(langKey);
        },
        languages: [
          {key: "en", title: "English"},
          {key: "uk", title: "Українська"},
          {key: "ru", title: "Русский"}
        ]
      });
    }
  }
});

skin.directive('logoutButton', () => {
  return {
    restrict: 'E',
    templateUrl: '/partials/logout-button.html'
  }
});

skin.directive('loginGoogleButton', () => {
  return {
    restrict: 'E',
    templateUrl: '/partials/login-google-button.html'
  }
});
