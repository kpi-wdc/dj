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

skin.directive('pageListNav', (appName) => {
  // TODO: synchronize css styles on active link after clicking
  return {
    restrict: 'E',
    templateUrl: '/partials/page-list-nav.html',
    require: '^MainController',
    controller($scope) {
      $scope.appName = appName;
    }
  }
});

skin.directive('languageSelectorNav', ($translate) => {
  return {
    restrict: 'E',
    templateUrl: '/partials/language-selector-nav.html',
    controller($scope) {
      angular.extend($scope, {
        selectLanguage(langKey) {
          $translate.use(langKey);
        }
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
