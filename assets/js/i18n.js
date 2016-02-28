import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

const i18n = angular.module('app.i18n', ['app','pascalprecht.translate']);

i18n.config(function ($translateProvider) {
  i18n.translateProvider = $translateProvider; 
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

i18n.constant('i18nTemp',{});
  
i18n.service('i18n',function($translate,config, i18nTemp, APIProvider, APIUser){
  
  if(!config.i18n){
    config.i18n = {}
  }

  for(let locale in config.i18n){
    i18n.translateProvider.translations(locale,config.i18n[locale]);
  }

  var user = new APIUser();
  user.invokeAll(APIProvider.TRANSLATE_SLOT);
    
  angular.extend(this,{

    formatDate : function(date){
      var locale = $translate.use() || "en";
      date = new Date(date);
      date = date.toLocaleString(locale,
        { year: 'numeric',  
          month: 'long',  
          day: 'numeric', 
          hour: 'numeric',  
          minute: 'numeric',
          second: 'numeric'
        })
      return date;
    },

    
    add: function (locale,translations,nosave){

      let table = (nosave) ? i18nTemp : config.i18n;
      
      table[locale] = (table[locale]) 
      ? table[locale] : {};
      for(let i in translations){table[locale][i] = translations[i]}
      i18n.translateProvider.translations(locale,table[locale]);
      user.invokeAll(APIProvider.TRANSLATE_SLOT);
    },

    remove: function(keys){
      for(let i in keys){
        for(let locale in config.i18n){
          delete config.i18n[locale][keys[i]] 
        }
      }
       $translate.refresh().then(() => {
          this.refresh();
      });

    },

    refresh : function(){
      for(let locale in config.i18n){
          i18n.translateProvider.translations(locale,config.i18n[locale]);
      }
      for(let locale in i18nTemp){
          i18n.translateProvider.translations(locale,i18nTemp[locale]);
      }
      // console.log("BEFORE invokeAll TRANSLATE")
      user.invokeAll(APIProvider.TRANSLATE_SLOT);
    }
  })
})  
