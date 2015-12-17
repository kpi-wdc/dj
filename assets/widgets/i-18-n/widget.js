import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';


var translateProvider = undefined; 
angular.module('app.widgets.i-18-n', ['pascalprecht.translate','angular-clipboard','app.i18n'])
  
  .config(function ($translateProvider) {
    translateProvider = $translateProvider;
  })

  .controller('I18NController', function ($scope, $http, EventEmitter, 
    APIProvider, APIUser, pageSubscriptions, $lookup, i18n, $translate, dialog, app, clipboard) {


    $scope.copyToClipboard = function(text){
      clipboard.copyText(text);
    }

    $scope.update = function(){
        var enT = {};
        var ukT = {};
        var ruT = {};
        if($scope.widget.translations.forEach){
          $scope.widget.translations.forEach(function(item){
            enT[item.key] = item.en;
            ukT[item.key] = item.ua;
            ruT[item.key] = item.ru;
          });
        }   
        i18n.add("uk",ukT);
        i18n.add("en",enT);
        i18n.add("ru",ruT);

    }

    $scope.deleteTranslation = function(translation){
      let i;
      for(i in $scope.widget.translations){
        if($scope.widget.translations[i].key == translation.key)
        break;  
      }
      $scope.widget.translations.splice(i,1);
      let t = {};
      t[translation.key] = {};
     
      i18n.remove("en",t);
      i18n.remove("ru",t);
      i18n.remove("uk",t);
      app.markModified(true);
    }

    $scope.createTranslation = function(){
      dialog({
        title:"Create translation",
        fields:{
          key:{title:"Key",editable:true,required:true},
          en:{title:"English",editable:true},
          ua:{title:"Ukrainian",editable:true},
          ru:{title:"Russian",editable:true}
        }
      }).then(function(form){
        app.markModified(true);
        let t = {};
        t[form.fields.key.value] = form.fields.ua.value;
        i18n.add("uk",t);
        t[form.fields.key.value] = form.fields.en.value;
        i18n.add("en",t);
        t[form.fields.key.value] = form.fields.ru.value;
        i18n.add("ru",t);form.fields.en.value,

        
        $scope.widget.translations.push(
          { key : form.fields.key.value,
            en : form.fields.en.value,
            ua : form.fields.ua.value,
            ru : form.fields.ru.value
          }
        )
      })
    }

    $scope.editTranslation = function(translation){
     dialog({
        title:"Edit translation",
        fields:{
          key:{title:"Key",editable:true,required:true, value:translation.key},
          en:{title:"English",editable:true,value:translation.en},
          ua:{title:"Ukrainian",editable:true,value:translation.ua},
          ru:{title:"Russian",editable:true,value:translation.ru}
        }
      }).then(function(form){
        app.markModified(true);
        if(translation.key != form.fields.key.value){
          $scope.deleteTranslation(translation)
        }
        let t = {};
        t[form.fields.key.value] = form.fields.ua.value;
        i18n.add("uk",t);
        t[form.fields.key.value] = form.fields.en.value;
        i18n.add("en",t);
        t[form.fields.key.value] = form.fields.ru.value;
        i18n.add("ru",t);
        
        let i;
        for(i in $scope.widget.translations){
          if($scope.widget.translations[i].key == translation.key)
          break;  
        }

        $scope.widget.translations[i] = 
         { key : form.fields.key.value,
          en : form.fields.en.value,
          ua : form.fields.ua.value,
          ru : form.fields.ru.value
        }
      }) 
    }


    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        // $scope.translations = $scope.widget.translations;
        $scope.update();
      })
      .removal(() => {
        console.log('KeyEmmiter widget is destroyed');
      });
  });
