import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

let l10n = angular.module('app.l10n', ['pascalprecht.translate']);

l10n.config(function ($translateProvider) {
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
      prefix: '/translations/',
      suffix: '.json'
    })
    .determinePreferredLanguage()
    //.preferredLanguage('en')
    .fallbackLanguage(['en', 'uk', 'ru']);
});

l10n.controller('LanguageSelectionController', function ($scope, $translate) {
  angular.extend($scope, {
    selectLanguage(langKey) {
      $translate.use(langKey);
    }
  });
});
