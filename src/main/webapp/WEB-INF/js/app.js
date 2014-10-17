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
                        return pageConfigPromise = $http.get('/json/pageconfig/' + $stateParams.name + '.json')
                            .then(function (result) {
                                return result.data;
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

                scope.widgetTemplateUrl = function (href) {
                    return '/widgets/' + href + '.html';
                };
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
