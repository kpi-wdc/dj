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

skin.directive('pageListNav', () => {
  return {
    restrict: 'E',
    template: `<widget type="page-list" non-configurable></widget>`
  }
});

skin.directive('languageSelectorNav', ($translate) => {
  return {
    restrict: 'E',
    templateUrl: '/partials/language-selector-nav.html',
    scope: {
      "showFlags": "="
    },
    link(scope) {
      angular.extend(scope, {
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
