define(['angular', '/widgets/non-visual-widget/widget.js'], function (angular) {
    angular.module('app.widgets.widget-with-dependency', ['app.widgets.non-visual-widget'])
        .controller('WidgetWithDependencyCtrl', function ($scope, NonVisualWidgetData) {
            $scope.text = NonVisualWidgetData;
    });
});
