define(['angular'], function (angular) {
    angular.module('app.widgets.summator', [])
        .controller('SummatorWidgetController', function ($scope) {
            $scope.a = 3;
            $scope.b = 5;
            $scope.sum = function () {
                return parseInt($scope.a) + parseInt($scope.b);
            }
    });
});