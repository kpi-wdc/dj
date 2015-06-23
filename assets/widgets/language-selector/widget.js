import angular from 'angular';

const langSelector = angular.module('app.widgets.language-selector', []);

langSelector.controller('LanguageSelectorController', function ($scope, $translate) {
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
});
