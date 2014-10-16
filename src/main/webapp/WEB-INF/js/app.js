define(['angular', 'angular-ui-router', 'oclazyload'], function (angular) {
    var app = angular.module('webapp', ['ui.router', 'oc.lazyLoad']);

    var pageListPromise;

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            })
            .state('page', {
                url: '/page/:name',
                templateUrl: function (urlattr) {
                    return '/templates/' + urlattr.name + '.html';
                }, controller: 'PageCtrl'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            });

        $urlRouterProvider.otherwise('/404');
    }).run(function ($http) {
        pageListPromise = $http.get('/json/pagelist.json');
    });

    app.controller('PageCtrl', function ($scope) {
       $scope.author = 'PageCtrl';
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
        pageListPromise.
            success(function (data) {
                $scope.pages = data;
            }).
            error(function (data, status) {
                alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angular.bootstrap(document, ['webapp']);
});
