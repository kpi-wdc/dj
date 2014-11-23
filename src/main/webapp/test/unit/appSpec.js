define(['js/app', 'angular-mocks'], function () {
    beforeEach(module('app'));
    describe("Testing controllers", function () {
        var MainCtrlScope;
        var PageCtrlScope;
        var $controller;
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

    describe("Services", function () {
        describe("widgets service", function () {
            var $rootScope;
            var scopeA;
            var scopeB;
            var scopeC;
            var widgetSlots;
            var APIProvider;
            var APIUser;
            var EventEmitter;
            beforeEach(inject(function (_$rootScope_, _widgetSlots_,
                _APIProvider_, _APIUser_, _EventEmitter_) {
                $rootScope = _$rootScope_;
                widgetSlots = _widgetSlots_;
                APIProvider = _APIProvider_;
                APIUser = _APIUser_;
                EventEmitter = _EventEmitter_;
                scopeA = $rootScope.$new();
                scopeB = $rootScope.$new();
                scopeC = $rootScope.$new();
                scopeA.widget = {instanceName: "a"};
                scopeB.widget = {instanceName: "b"};
                scopeC.widget = {instanceName: "c"};
            }));

            afterEach(function () {
                scopeA.$destroy();
                scopeB.$destroy();
                scopeC.$destroy();
            });

            it('should correctly clean-up widgetSlots when scope is destroyed', function () {
                var a = new APIProvider(scopeA);
                a.provide('slot', angular.noop);
                expect(Object.keys(widgetSlots).length).toEqual(1);
                scopeA.$destroy();
                expect(Object.keys(widgetSlots).length).toEqual(0);
            });

            it('slot handlers should be called with correct evt object', function () {
                var a = new EventEmitter(scopeA);
                var b = new APIProvider(scopeB);
                var slot = jasmine.createSpy('slot');
                b.provide('slot', slot);
                EventEmitter.wireSignalWithSlot('a', 'hello', 'b', 'slot');
                a.emit('hello');
                $rootScope.$digest();
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: 'hello'
                });
            });

            it('slot handlers should be called with correct arguments', function () {
                var a = new EventEmitter(scopeA);
                var b = new APIProvider(scopeB);
                var slot = jasmine.createSpy('slot');
                b.provide('slot', slot);
                EventEmitter.wireSignalWithSlot('a', 'hello', 'b', 'slot');
                a.emit('hello', 123);
                $rootScope.$digest();
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: 'hello'
                }, 123);
            });

            it('ensure APIUser::invoke calls', function () {
                var a = new APIUser(scopeA);
                var b = new APIProvider(scopeB);
                var slot = jasmine.createSpy('slot').and.returnValue(1234);
                b.provide('slot', slot);
                expect(a.invoke('b', 'slot')).toBe(1234);
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: undefined
                });
                expect(function () {
                    a.invoke('b', 'non-existing-slot')
                }).toThrow();
            });
        });
    });
});
