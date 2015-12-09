import angular from 'angular';

const langSelector = angular.module('app.widgets.language-selector', []);

langSelector.controller('LanguageSelectorController', function ($scope, $translate,$lookup) {
  angular.extend($scope, {
    selectLanguage(langKey) {
      $translate.use(langKey);
      $translate.refresh().then(() => {$lookup.refresh()});
    },
    languages: [
      {key: "en", title: "English"},
      {key: "uk", title: "Українська"},
      {key: "ru", title: "Русский"}
    ]
  });
});
