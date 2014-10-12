define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module("webapp", ['ngRoute']);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/", angularAMD.route({
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            }))
            .when("/page/:name", angularAMD.route({
                templateUrl: function (urlattr) {
                    return 'views/' + urlattr.name + '.html';
                }, controller: 'ViewCtrl'
            }))
            .when("/404", angularAMD.route({
                templateUrl: 'views/404.html'
            }))
            .otherwise({redirectTo: "/404"});
    });

    app.controller('SectionsController', function ($scope) {
        $scope.sections = [
            'About',
            'Index',
            'Bla-bla',
            'Some section'
        ]
    });

    return angularAMD.bootstrap(app);
});
