define(['angular'], function (angular) {
    angular.module('app.widgets.htmlwidget', [])
        .controller('HtmlWidgetController', function ($scope, $sce) {
            $scope.text = $sce.trustAsHtml($scope.widget.text);
        });
});
