import angular from 'angular';

angular.module('app.widgets.htmlwidget', [])
    .controller('HtmlWidgetController', function($scope, $sce, APIProvider,i18n,dialog) {
        new APIProvider($scope)
            .config(() => {
                $scope.text = $sce.trustAsHtml($scope.widget.text);
            })
            .provide('setData', (e, context) => {
                if (!context) {
                    $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                    $scope.hidden = true;
                    return
                }
                if (context.key == "html") {
                	$scope.container.getElement()[0].children[0].children[0].innerHTML = context.data;
                    $scope.hidden = false;
                } else {
                    $scope.hidden = true;
                    $scope.container.getElement()[0].children[0].children[0].innerHTML = "";
                }
            })
            
    });
