import angular from 'angular';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

angular.module('app.widgets.dm-lookup', ['pascalprecht.translate'])
  .config(function ($translateProvider) {
    angular.translateProvider = $translateProvider;
  })
  .controller('DataManagerLookupController', function ($scope, $http, EventEmitter, APIProvider, $translate) {
  

    // const eventEmitter = new EventEmitter($scope);
    // For direct slot invocation
    // inject APIUser and use the following code
    // var apiUser = new APIUser($scope);
    // apiUser.invoke('widgetName', 'slotName', args...)

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        // $translate( "#WB_NAME").then(function(t){console.log(t)});
        // console.log($translate);
        
        $scope.key = $scope.key || "#WB";
        if(!$scope.dictionary){
          $http.get("./data/dictionary_example.json")
            .success(function (data) {
                var d = {};
                for(let i in data){
                  d[data[i].key] = data[i].value;
                }
                $scope.dictionary = d;
                $scope.object = $scope.dictionary[$scope.key];
                // console.log($scope.object);
                var tua = {};
                var ten = {}
                for(let i in data){
                  if (data[i].type == "i18n") {
                    tua[data[i].key] = data[i].value.ua;
                    ten[data[i].key] = data[i].value.en;
                  }
                }
               angular.translateProvider.translations("uk",tua);
               angular.translateProvider.translations("en",ten);
            });
        }else{
          $scope.object = $scope.dictionary[$scope.key];
        }
      })
      .provide('setLookupKey', (evt, value) => {
        console.log("LOOKUP", value)
        $scope.key = value;
        $scope.object = $scope.dictionary[$scope.key];
      })
      
      //.openCustomSettings(() => {
      //    console.log('Opening custom settings...');
      //})
      .removal(() => {
        console.log('Lookup widget is destroyed');
      });

    // $scope.$watch('sum()', (newValue) => {
    //   eventEmitter.emit('sumUpdated', newValue);
    // });
  });




