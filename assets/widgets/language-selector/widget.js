import angular from 'angular';

const langSelector = angular.module('app.widgets.language-selector', ['app.i18n']);

langSelector.controller('LanguageSelectorController', function ($scope, 
                        $translate, $lookup, EventEmitter, APIProvider, i18n) {
  
  const eventEmitter = new EventEmitter($scope);
  angular.extend($scope, {
    selectLanguage(langKey) {
      $translate.use(langKey);
      $translate.refresh().then(() => {i18n.refresh()});
      eventEmitter.emit("selectLanguage",langKey);
    },
    languages: [
      {key: "en", title: "English"},
      {key: "uk", title: "Українська"},
      {key: "ru", title: "Русский"}
    ]
  });


});
