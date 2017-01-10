import angular from 'angular';
import 'dictionary';
import 'ngReact';
import 'custom-react-directives';
import 'ng-prettyjson';

// console.log("REACT",React);
let m = angular.module('app.widgets.v2.script-help', [
    'app.dictionary',
    'app.dps',
    'ngFileUpload',
    'react',
    'custom-react-directives',
    'ngPrettyJson'
])


m.controller('ScriptHelpController', function($scope, $http, $dps, EventEmitter,
    APIProvider, pageSubscriptions, $lookup, $translate, $modal,
    user, i18n, $scroll, clipboard, dialog, $error) {


    $scope.getCommandHelp = function(command) {

        $dps.post("/api/script", {
                "script": "help('" + command + "')",
                "locale": i18n.locale()
            })
            .then(function(response) {
                response.data.key = response.data.type;
                if (response.data.key == 'error') {
                    $error(response.data.data)
                } else {
                    $scope.help = response.data.data;
                    if(!$scope.help.warning){
                        $scope.script = $scope.help.example.code
                            .replace(/\\n/g, "\n")
                            .replace(/\\t/g, "\t");
                    }        
                }
            })
    }

    new APIProvider($scope)
        .config(() => {
            console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
            $scope.getCommandHelp("")
        })
        .provide('setData', (e, context) => {
            if (!context) {
                $scope.hidden = true;
                return
            }
            if (context.key == "help") {
                $scope.help = context.data;
                if(!$scope.help.warning){
                    $scope.script = $scope.help.example.code
                        .replace(/\\n/g, "\n")
                        .replace(/\\t/g, "\t");
                }
                $scope.hidden = false;
            } else {
                $scope.hidden = true;
            }
        })
        .removal(() => {
            console.log('Script widget is destroyed');
        });
})
