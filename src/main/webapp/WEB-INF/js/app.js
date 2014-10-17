define(['angular', 'angular-ui-router'], function (angular) {
    var app = angular.module('webapp', ['ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            })
            .state('page', {
                url: '/page/:name',
                resolve: {
                    pageConfig: function ($stateParams, $q, $http, $rootScope) {
                        return $rootScope.pageConfigPromise = $rootScope.pageListPromise.then(function (result) {
                            var pages = result.data;
                            var id = -1;
                            for (var pageIndex in pages) {
                                if (pages[pageIndex].href === $stateParams.name) {
                                    id = pages[pageIndex].id;
                                    return $http.get('/json/pageconfig/' + id + '.json')
                                        .then(function (result) {
                                            return result.data;
                                        });
                                }
                            }
                            return $q.reject('Can\'t find page id with href="' + $stateParams.name + '"');
                        });
                    }
                },
                templateProvider: function ($http, $rootScope) {
                    return $rootScope.pageConfigPromise.then(function (pageConfig) {
                        return $http.get('/templates/' + pageConfig.templateName + '.html')
                            .then(function (result) {
                                return result.data;
                            });
                    });
                },
                controller: 'PageCtrl'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'views/404.html'
            });

        $urlRouterProvider.otherwise('/404');
    }).run(function ($http, $rootScope) {
        $rootScope.pageListPromise = $http.get('/json/pagelist.json');
    });

    app.controller('PageCtrl', function ($scope, pageConfig) {
       $scope.author = 'PageCtrl';
       $scope.config = angular.toJson(pageConfig, true);
    });

    app.directive('widgetHolder', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/widget-holder.html'
        }
    });

    app.controller('SectionsController', function ($scope) {
        $scope.sections = [
            'About',
            'Index',
            'Bla-bla',
            'Some section'
        ]
    });

    app.controller('PageNavigationController', function ($rootScope, $scope, $http) {
        $rootScope.pageListPromise
            .success(function (data) {
                $scope.pages = data;
            })
            .error(function (data, status) {
                alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angular.bootstrap(document, ['webapp']);
});
