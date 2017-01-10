import angular from 'angular';

angular.module('app.widgets.html-dynamic', [])
    .controller('HtmlDynaController', function($scope, APIProvider, i18n, dialog, $dps, $error) {
        
        $scope.update = function(){
            if($scope.script){
                $dps.post("/api/script",{
                    "script": $scope.script,
                    "locale": i18n.locale()
                })
                .then((resp) => {
                    if (resp.data.type == "error") {
                                $error(resp.data.data);
                                 $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                                return
                            };
                    $scope.container.getElement()[0].children[0].children[0].innerHTML = resp.data.data;
                })
            }else{
                 $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
            }
        }

        new APIProvider($scope)
            .config(() => {
                $scope.script = $scope.widget.script;
                $scope.update()
            })

            .openCustomSettings(() =>{
                dialog({
                    title: "Edit dpscript for html generation",
                    fields: {
                        script: {
                            title: "Script",
                            type: "textarea",
                            value: $scope.script,
                            required: false
                        }
                    }
                }).then((form) => {
                    $scope.widget.script = form.fields.script.value;
                    $scope.script = form.fields.script.value;
                    $scope.update();
                })     
            })
            
    });
