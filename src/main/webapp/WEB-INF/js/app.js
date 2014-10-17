define(['angular', 'angular-ui-router'], function (angular) {
    var app = angular.module('webapp', ['ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        var pageConfigPromise;
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            })
            .state('page', {
                url: '/page/:name',
                resolve: {
                    pageConfig: function ($stateParams, $q, $http, pageListPromise) {
                        return pageConfigPromise = pageListPromise.then(function (result) {
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
                templateProvider: function ($http) {
                    return pageConfigPromise.then(function (pageConfig) {
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
    }).factory('pageListPromise', function ($http) {
        return $http.get('/json/pagelist.json');
    });

    app.controller('PageCtrl', function ($scope, pageConfig) {
       $scope.author = 'PageCtrl';
       $scope.config = pageConfig;
       $scope.configStr = angular.toJson(pageConfig, true);
    });

    app.directive('widgetHolder', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/widget-holder.html',
            transclude: true,
            scope: true,
            link: function (scope, element, attrs) {
                scope.$watchCollection('scope.config.holders', function () {
                    scope.holderConfig = scope.config.holders[attrs.name];
                });
            }
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

    app.controller('PageNavigationController', function (pageListPromise, $scope, $http) {
        pageListPromise
            .success(function (data) {
                $scope.pages = data;
            })
            .error(function (data, status) {
                alert('$http error ' + status + ' - cannot load json/pagelist.json!');
            });
    });

    return angular.bootstrap(document, ['webapp']);
});
