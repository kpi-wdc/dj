import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

const dictionaryModule = angular.module('app.dictionary', ['pascalprecht.translate']);
dictionaryModule.dictionary = {};
dictionaryModule.translations = {};



dictionaryModule.config(function ($translateProvider) {
  dictionaryModule.translateProvider = $translateProvider;
});

dictionaryModule.run(function ($http) {
  
  var _translations = function (locale,translations){
   dictionaryModule.translations[locale] = (dictionaryModule.translations[locale]) ? dictionaryModule.translations[locale] : {};
    for(let i in translations){
      dictionaryModule.translations[locale][i] = translations[i];
    }
     dictionaryModule.translateProvider.translations(locale,dictionaryModule.translations[locale]);
  } 

  $http.get("./api/dictionary")
            .success(function (data) {
                var d = {};
                for(let i in data){
                  d[data[i].key] = data[i].value;
                }
                dictionaryModule.dictionary = d;
                var tua = {};
                var ten = {};
                for(let i in data){
                  if (data[i].type == "i18n") {
                    tua[data[i].key] = data[i].value.ua;
                    ten[data[i].key] = data[i].value.en;
                  }
                }
               _translations("uk",tua);
               _translations("en",ten);
            });
});

dictionaryModule.service("$lookup",[ "$http", function($http){
  

  var lookup = function(key){
    return dictionaryModule.dictionary[key] || key
  };

  var _translations = function (locale,translations){
    dictionaryModule.translations[locale] = (dictionaryModule.translations[locale]) ? dictionaryModule.translations[locale] : {};
    for(let i in translations){
      dictionaryModule.translations[locale][i] = translations[i];
    }
     dictionaryModule.translateProvider.translations(locale,dictionaryModule.translations[locale]);
  } 

  lookup.reload = function(){
    $http.get("./api/dictionary")
            .success(function (data) {
                var d = {};
                for(let i in data){
                  d[data[i].key] = data[i].value;
                }
                dictionaryModule.dictionary = d;
                var tua = {};
                var ten = {};
                for(let i in data){
                  if (data[i].type == "i18n") {
                    tua[data[i].key] = data[i].value.ua;
                    ten[data[i].key] = data[i].value.en;
                  }
                }
                _translations("uk",tua);
                _translations("en",ten);
          });
    }
  
  lookup.translations = _translations;

  lookup.refresh = function(){
    for(let locale in dictionaryModule.translations){
        dictionaryModule.translateProvider.translations(locale,dictionaryModule.translations[locale]);
    } 
  }  

  return lookup;
}]);
