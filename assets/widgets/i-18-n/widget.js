import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';


var translateProvider = undefined; 
angular.module('app.widgets.i-18-n', ['pascalprecht.translate'])
  
  .config(function ($translateProvider) {
    translateProvider = $translateProvider;
  })

  .controller('I18NController', function ($scope, $http, EventEmitter, 
    APIProvider, APIUser, pageSubscriptions) {
    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.translations = $scope.widget.translations;
        var enT = {};
        var ukT = {};
        var ruT = {};
        $scope.translations.forEach(function(item){
          console.log(item);
          enT[item.key] = item.en;
          ukT[item.key] = item.ua;
          ruT[item.key] = item.ru;
        }); 
        console.log(ukT,enT,ruT);
        translateProvider.translations("uk",ukT);
        translateProvider.translations("en",enT);
        translateProvider.translations("ru",ruT);
        

      })
      .removal(() => {
        console.log('KeyEmmiter widget is destroyed');
      });
  });
