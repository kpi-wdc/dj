define(['angular'], function (angular) {
    angular.module('app.widgets.summator', [])
        .controller('SummatorWidgetController', function ($scope) {
            $scope.a = $scope.widget.a || 3;
            $scope.b = $scope.widget.b || 5;
            $scope.sum = function () {
                return parseInt($scope.a) + parseInt($scope.b);
            }
    });
});