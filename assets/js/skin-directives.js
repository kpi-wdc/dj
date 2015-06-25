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
    template: `<widget type="page-list" instanceName="page-list-nav"></widget>`
  }
});

skin.directive('languageSelectorNav', () => {
  return {
    restrict: 'E',
    template: `<widget type="language-selector" instanceName="language-selector"></widget>`
  }
});

skin.directive('appLogo', () => {
  return {
    restrict: 'E',
    template: `<widget type="app-logo" instanceName="app-logo-widget"></widget>`
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
