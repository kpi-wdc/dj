define(['app'], function (app) {
    app.controller('SummatorWidgetController', function ($scope) {
        $scope.a = 3;
        $scope.b = 5;
        $scope.sum = function () {
            return $scope.a + $scope.b;
        }
    });
});