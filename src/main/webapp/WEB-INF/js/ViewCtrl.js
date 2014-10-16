define(['app'], function (app) {
    app.controller('ViewCtrl', function ($scope, $routeParams) {
        $scope.author = 'ViewCtrl';
        $scope.widgetId = $routeParams.name;
    });
});
