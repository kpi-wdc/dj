import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

const i18n = angular.module('app.i18n', ['pascalprecht.translate']);

i18n.config(function ($translateProvider) {
  $translateProvider
    .useSanitizeValueStrategy('escape')
    .registerAvailableLanguageKeys(['en', 'uk', 'ru'], {
      'en*': 'en',
      'uk*': 'uk',
      'ru*': 'ru'
    })
    .useStaticFilesLoader({
      prefix: '/i18n/',
      suffix: '.json'
    })
    .determinePreferredLanguage()
    .useLocalStorage();
});

i18n.run(function ($translate) {
  // HACK. $translateProvider.fallbackLanguage Should have been used in i18n.config
  // This caused problems - see
  // https://github.com/angular-translate/angular-translate/issues/1075
  $translate.fallbackLanguage(['en', 'uk', 'ru']);
});

i18n.controller('LanguageSelectionController', function ($scope, $translate) {
  angular.extend($scope, {
    selectLanguage(langKey) {
      $translate.use(langKey);
    }
  });
});
