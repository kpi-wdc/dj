define(['angular'], function (angular) {
    angular.module('app.widgets.summator', [])
        .controller('SummatorWidgetController', function ($scope, EventEmitter, APIProvider) {
            var eventEmitter = new EventEmitter($scope);
            // For direct slot invocation
            // inject APIUser and use the following code
            // var apiUser = new APIUser($scope);
            // apiUser.invoke('widgetName', 'slotName', args...)

            new APIProvider($scope)
                .config(function () {
                    console.log('widget ' + $scope.widget.instanceName + ' is (re)configuring...');
                    $scope.a = $scope.widget.a || 3;
                    $scope.b = $scope.widget.b || 5;
                    $scope.sum = function () {
                        return parseInt($scope.a) + parseInt($scope.b);
                    };
                })
                .provide('setValueOfA', function (evt, value) {
                    $scope.a = value;
                })
                .provide('setValueOfB', function (evt, value) {
                    $scope.b = value;
                })
                .destroy(function () {
                    console.log('Summator widget is destroyed');
                });

            $scope.$watch('sum()', function (newValue) {
                eventEmitter.emit('sumUpdated', newValue);
            });
        });
});
