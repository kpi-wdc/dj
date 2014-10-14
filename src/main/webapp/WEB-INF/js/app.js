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

    app.controller('PageNavigationController', function ($scope, $http) {
        $http.get('/json/pagelist.json').
            success(function (data, status, header, config) {
                $scope.pages = data;
            }).
            error(function (data, status, header, config) {
                alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angularAMD.bootstrap(app);
});
