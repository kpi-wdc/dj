define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module("webapp", ['ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/", angularAMD.route({
                templateUrl: 'views/1.html', controller: 'HomeCtrl', controllerUrl: 'con1'
            }))
            .when("/view2", angularAMD.route({
                templateUrl: 'views/2.html', controller: 'View1Ctrl', controllerUrl: 'con2'
            }))
            .otherwise({redirectTo: "/"});
    });

    return angularAMD.bootstrap(app);
});
