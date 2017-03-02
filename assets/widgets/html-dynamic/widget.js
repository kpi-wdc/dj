import angular from 'angular';


angular.module('app.widgets.html-dynamic', [])
    .controller('HtmlDynaController', function($scope, APIProvider, i18n, dialog, $dps, $error, $sce, dpsEditor) {
        
        $scope.update = function(){
            if($scope.script){
                $dps.post("/api/script",{
                    "script": $scope.script,
                    "locale": i18n.locale()
                })
                .then((resp) => {
                    if (resp.data.type == "error") {
                                $error(resp.data.data);
                                $scope.html =  "";
                                 // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                                return
                            };
                    $scope.html =  $sce.trustAsHtml(resp.data.data);
                    // $scope.container.getElement()[0].children[0].children[0].innerHTML = resp.data.data;
                })
            }else{
                 $scope.html =  "";
                 // $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
            }
        }

        new APIProvider($scope)
            .config(() => {
                $scope.script = $scope.widget.script;
                $scope.update()
            })

            .openCustomSettings(() => {
                dpsEditor($scope.script)
                    .then((script) => {
                        $scope.script = script;
                        $scope.widget.script = script;
                        $scope.update();
                    })
            })
            
    });
