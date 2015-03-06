import angular from 'angular';

angular.module('app.widgets.summator', [])
  .controller('SummatorWidgetController', function ($scope, EventEmitter, APIProvider) {
    var eventEmitter = new EventEmitter($scope);
    // For direct slot invocation
    // inject APIUser and use the following code
    // var apiUser = new APIUser($scope);
    // apiUser.invoke('widgetName', 'slotName', args...)

    new APIProvider($scope)
      .config(() => {
        console.log(`widget ${$scope.widget.instanceName} is (re)configuring...`);
        $scope.a = $scope.widget.a || 3;
        $scope.b = $scope.widget.b || 5;
        $scope.sum = ()  =>
        parseFloat($scope.a) + parseFloat($scope.b);
      })
      .provide('setValueOfA', (evt, value) => {
        $scope.a = value;
      })
      .provide('setValueOfB', (evt, value) => {
        $scope.b = value;
      })
      //.openCustomSettings(() => {
      //    console.log('Opening custom settings...');
      //})
      .removal(() => {
        console.log('Summator widget is destroyed');
      });

    $scope.$watch('sum()', (newValue) => {
      eventEmitter.emit('sumUpdated', newValue);
    });
  });
