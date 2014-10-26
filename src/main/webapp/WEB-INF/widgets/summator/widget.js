define(['angular'], function (angular) {
    angular.module('app.widgets.summator', [])
        .controller('SummatorWidgetController', function ($scope, widgetEvents) {
            var publisher = widgetEvents.createPublisher($scope);
            var subscriber = widgetEvents.createSubscriber($scope);

            $scope.a = $scope.widget.a || 3;
            $scope.b = $scope.widget.b || 5;
            $scope.sum = function () {
                return parseInt($scope.a) + parseInt($scope.b);
            };

            $scope.$watch('sum()', function (newValue) {
                publisher.send('sumUpdated', newValue);
            });

            subscriber.on('setValueOfA', function (value) {
                $scope.a = value;
            });
    });
});
