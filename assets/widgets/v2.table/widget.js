import angular from 'angular';
import "custom-react-directives";
import "angular-oclazyload";
import 'widgets/v2.table/wizard';

const m = angular.module('app.widgets.v2.table', [
    "oc.lazyLoad",
    "custom-react-directives",
    'app.widgets.v2.table-wizard',
    "app.dps"
]);


m.controller('TableCtrl', function(
    $scope,
    $http,
    $dps,
    $ocLazyLoad,
    APIProvider,
    pageSubscriptions,
    TableWizard,
    i18n,
    $error) {

    $ocLazyLoad.load({
        files: [
            "/widgets/v2.table/data-widget.css"
        ]
    });

    $scope.select = () => {
        let t = angular.copy($scope.table);

        if ($scope.columnSelection) {
            let indexes = []
            t.header = t.header.filter((h, index) => {
                let f = false;
                h.metadata.forEach((m) => {
                    f |= $scope.columnSelection.filter((s) => s.key == m.label && !s.disabled).length > 0
                })
                if (f) indexes.push(index)
                return f;
            })
            t.body.forEach((r) => {
                r.value = r.value.filter((v, index) => indexes.indexOf(index) >= 0)
            })
        }

        if ($scope.rowSelection) {
            t.body = t.body.filter((r) => {
                let f = false;
                r.metadata.forEach((m) => {
                    f |= $scope.rowSelection.filter((s) => s.key == m.label && !s.disabled).length > 0
                })
                return f;
            })
        }

        $scope.settings = { table: t, decoration: angular.copy($scope.decoration) }
    }

    $scope.update = function() {
        $scope.pending = angular.isDefined($scope.widget.dataID);
        if ($scope.pending) {
            $dps.get("/api/data/process/" + $scope.widget.dataID)
                .success((resp) => {
                    $scope.pending = false;
                    $scope.table = resp.value;
                    $scope.decoration = $scope.widget.decoration;
                    $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) }
                })
        } else {
            if ($scope.widget.script) {
                $dps
                    .post("/api/script", {
                        "script": $scope.widget.script,
                        "locale": i18n.locale()
                    })
                    .then((resp) => {
                        if (resp.data.type == "error") {
                            $error(resp.data.data)
                            return
                        };
                        $scope.table = resp.data.data;
                        $scope.decoration = $scope.widget.decoration;
                        $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) }
                    })
            } else {
                $http.get("./widgets/v2.table/sample.json")
                    .success((resp) => {
                        $scope.table = resp.value;
                        $scope.decoration = $scope.widget.decoration;
                        $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) }
                    })
            }
        }
    }

    new APIProvider($scope)
        .config(() => {
            // console.log($scope.widget)
            if ($scope.widget.emitters && $scope.widget.emitters.length &&
                $scope.widget.emitters.trim().length > 0) {
                pageSubscriptions().removeListeners({
                    receiver: $scope.widget.instanceName,
                    signal: "selectSerie"
                });
                pageSubscriptions().removeListeners({
                    receiver: $scope.widget.instanceName,
                    signal: "selectObject"
                });

                $scope.emitters = ($scope.widget.emitters) ? $scope.widget.emitters.split(",") : [];


                $scope.emitters = $scope.emitters.map((item) => {
                    let l = item.trim().split(".")
                    return { emitter: l[0], signal: l[1], slot: l[2], receiver: $scope.widget.instanceName }
                })

                pageSubscriptions().addListeners($scope.emitters)


            } else {
                pageSubscriptions().removeListeners({
                    receiver: $scope.widget.instanceName,
                    signal: "selectSerie"
                });
                pageSubscriptions().removeListeners({
                    receiver: $scope.widget.instanceName,
                    signal: "selectObject"
                });
            }
            $scope.update();
        }, true)

    .openCustomSettings(function() {
        $scope.wizard = TableWizard;
        return $scope.wizard.start($scope);
    })

    .provide("selectRow", (e, selection) => {
        $scope.rowSelection = selection;
        $scope.select();
    })

    .provide("selectColumn", (e, selection) => {
            $scope.columnSelection = selection;
            $scope.select();
        })
        .provide('setData', (e, context) => {
            // console.log("TABLE SET DATA", context)
            if (!context) {
                $scope.hidden = true;
                return
            }
            if (context.key == "table") {
                $scope.dataset = context.dataset;
                $scope.table = context.data;
                $scope.hidden = false;
                $scope.pending = false;
                $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) }
            } else {
                if ($scope.dataset != context.dataset) {
                    $scope.hidden = true;
                }
            }

        })
        .provide('updateWithData', (e, context) => {
            
            if (!context) return

            if (context.widget) {
                context.widget = (context.widget.forEach) ? context.widget : [context.widget]
            }

            if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {

                $scope.dataset = context.dataset;
                $scope.table = context.data;
                $scope.pending = false;
                $scope.settings = { table: angular.copy($scope.table), decoration: angular.copy($scope.decoration) }
                
                if (context.options){
                    $scope.hidden = context.options.hidden;
                }
            }



        })
        .provide('updateWithOptions', (e, context) => {
            
            if (!context) return

            if (context.widget) {
                context.widget = (context.widget.forEach) ? context.widget : [context.widget]
            }

            if (!context.widget || (context.widget.indexOf($scope.widget.instanceName) >= 0)) {
                $scope.hidden = context.options.hidden;
            }

        })

});
