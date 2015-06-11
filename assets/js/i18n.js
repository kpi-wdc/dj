import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

const i18n = angular.module('app.i18n', ['pascalprecht.translate']);

i18n.config(function ($translateProvider) {
  $translateProvider
    .useSanitizeValueStrategy('escape')
    .useLocalStorage()
    .registerAvailableLanguageKeys(['en', 'uk', 'ru'], {
      'en_US': 'en',
      'en_GB': 'en',
      'uk_UA': 'uk',
      'ru_RU': 'ru'
    })
    .useStaticFilesLoader({
      prefix: '/i18n/',
      suffix: '.json'
    })
    .determinePreferredLanguage()
    //.preferredLanguage('en')
    .fallbackLanguage(['en', 'uk', 'ru']);
});

i18n.controller('LanguageSelectionController', function ($scope, $translate) {
  angular.extend($scope, {
    selectLanguage(langKey) {
      $translate.use(langKey);
    }
  });
});
