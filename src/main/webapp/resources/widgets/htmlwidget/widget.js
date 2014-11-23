define(['angular'], function (angular) {
    angular.module('app.widgets.htmlwidget', [])
        .controller('HtmlWidgetController', function ($scope, $sce, APIProvider) {
            new APIProvider($scope)
                .config(function () {
                    $scope.text = $sce.trustAsHtml($scope.widget.text);
                });
        });
});
