define(['js/app', 'angular-mocks'], function () {
    describe("Testing controllers", function () {
        var MainCtrlScope;
        var PageCtrlScope;
        var $controller;
        beforeEach(module('app'));
        beforeEach(inject(function (_$controller_, $rootScope) {
            $controller = _$controller_;
            MainCtrlScope = $rootScope.$new();
            PageCtrlScope = $rootScope.$new();
        }));

        it('ensure MainCtrl exists and works', function() {
            $controller('MainCtrl', {$scope: MainCtrlScope, $window: {alert: angular.noop}});
            expect(MainCtrlScope).toBeDefined();
            MainCtrlScope.alertAppConfigSubmissionFailed({ data: {
                status: 404,
                statusText: 'Page not found'
            }});
        });

        it('ensure PageCtrl exists and works', function() {
            $controller('PageCtrl', {$scope: PageCtrlScope, pageConfig: {}, $window: {
                prompt: angular.noop,
                alert: angular.noop
            }});
            expect(PageCtrlScope).toBeDefined();
        });
    });
});
