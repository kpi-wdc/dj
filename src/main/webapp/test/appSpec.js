define(['js/app', 'angular-mocks'], function () {
    describe("Testing services", function () {
        var urls;
        var MainCtrlScope;
        beforeEach(module('app'));
        beforeEach(inject(function ($controller, $rootScope, appUrls) {
            urls = appUrls;
            MainCtrlScope = $rootScope.$new();
            $controller('MainController', {$scope: MainCtrlScope}); // TODO: rename to MyCtrl
        }));

        it('ensure MainController exists and works', function() {
            expect(MainCtrlScope).toBeDefined();
            MainCtrlScope.alertAppConfigSubmissionFailed({ data: {
                status: 404,
                statusText: 'Page not found'
            }});
        });
    });
});
