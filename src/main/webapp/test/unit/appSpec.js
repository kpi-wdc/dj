define(['js/app', 'angular-mocks'], () => {
    beforeEach(module('app'));

    let emptyAppJson = {
        "sections" : [],
        "pages" : []
    };

    let noWidgetsJson = {
    };

    let $httpBackend;

    beforeEach(inject((_$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        $httpBackend.whenGET('/apps/app.json')
            .respond(JSON.stringify(emptyAppJson));
        $httpBackend.whenGET('/widgets/widgets.json')
            .respond(JSON.stringify(noWidgetsJson));
    }));

    describe("Testing controllers", () => {
        let MainCtrlScope;
        let PageCtrlScope;
        let $controller;
        beforeEach(inject((_$controller_, $rootScope) => {
            $controller = _$controller_;
            MainCtrlScope = $rootScope.$new();
            PageCtrlScope = $rootScope.$new();
        }));

        it('ensure MainCtrl exists and works', () => {
            $controller('MainCtrl', {$scope: MainCtrlScope});
            expect(MainCtrlScope).toBeDefined();
            MainCtrlScope.alertAppConfigSubmissionFailed({ data: {
                status: 404,
                statusText: 'Page not found'
            }});
        });

        it('ensure PageCtrl exists and works', () => {
            $controller('PageCtrl', {$scope: PageCtrlScope, pageConfig: {}});
            expect(PageCtrlScope).toBeDefined();
        });
    });

    describe("Services", () => {
        describe("widgets service", () => {
            let $rootScope;
            let scopeA;
            let scopeB;
            let scopeC;
            let widgetSlots;
            let APIProvider;
            let APIUser;
            let EventEmitter;
            beforeEach(inject((_$rootScope_, _widgetSlots_, _APIProvider_,
                               _APIUser_, _EventEmitter_) => {
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

            afterEach(() => {
                scopeA.$destroy();
                scopeB.$destroy();
                scopeC.$destroy();
            });

            it('should correctly clean-up widgetSlots when scope is destroyed', () => {
                let a = new APIProvider(scopeA);
                a.provide('slot', angular.noop);
                expect(Object.keys(widgetSlots).length).toEqual(1);
                scopeA.$destroy();
                expect(Object.keys(widgetSlots).length).toEqual(0);
            });

            it('slot handlers should be called with correct evt object', () => {
                let a = new EventEmitter(scopeA);
                let b = new APIProvider(scopeB);
                let slot = jasmine.createSpy('slot');
                b.provide('slot', slot);
                EventEmitter.wireSignalWithSlot('a', 'hello', 'b', 'slot');
                a.emit('hello');
                $rootScope.$digest();
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: 'hello'
                });
            });

            it('slot handlers should be called with correct arguments', () => {
                let a = new EventEmitter(scopeA);
                let b = new APIProvider(scopeB);
                let slot = jasmine.createSpy('slot');
                b.provide('slot', slot);
                EventEmitter.wireSignalWithSlot('a', 'hello', 'b', 'slot');
                a.emit('hello', 123);
                $rootScope.$digest();
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: 'hello'
                }, 123);
            });

            it('ensure APIUser::invoke calls', () => {
                let a = new APIUser(scopeA);
                let b = new APIProvider(scopeB);
                let slot = jasmine.createSpy('slot').and.returnValue(1234);
                b.provide('slot', slot);
                expect(a.invoke('b', 'slot')).toBe(1234);
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: undefined
                });
                expect(() => {
                    a.invoke('b', 'non-existing-slot')
                }).toThrow();
            });

            it('ensure APIUser::tryInvoke calls', () => {
                let a = new APIUser(scopeA);
                let b = new APIProvider(scopeB);
                let slot = jasmine.createSpy('slot').and.returnValue(1234);
                b.provide('slot', slot);
                let okInvocation = a.tryInvoke('b', 'slot');
                expect(okInvocation.success).toBe(true);
                expect(okInvocation.result).toBe(1234);
                expect(slot).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: undefined
                });
                let badInvocation = a.tryInvoke('b', 'non-existing-slot');
                expect(badInvocation.success).toBe(false);
                expect(badInvocation.result).toBeUndefined();
            });

            it('ensure APIUser::invokeAll calls', () => {
                let aUser = new APIUser(scopeA);
                let aProvider = new APIProvider(scopeA);
                let bUser = new APIUser(scopeB);
                let bProvider = new APIProvider(scopeB);
                let slotB = jasmine.createSpy('slotB').and.returnValue(1);
                let slotA = jasmine.createSpy('slotA').and.returnValue(2);
                let slotOther = jasmine.createSpy('slotOther').and.returnValue(3);
                bProvider.provide('slot', slotB);
                expect(aUser.invokeAll('slot'));
                expect(slotB).toHaveBeenCalledWith({
                    emitterName: 'a',
                    signalName: undefined
                });
                aProvider.provide('slot', slotA);
                expect(bUser.invokeAll('slot'));
                expect(slotA).toHaveBeenCalledWith({
                    emitterName: 'b',
                    signalName: undefined
                });
                expect(slotB).toHaveBeenCalledWith({
                    emitterName: 'b',
                    signalName: undefined
                });
                expect(slotOther).not.toHaveBeenCalled();
            });

            it('ensure getScopeByName works', () => {
                let a = new APIUser(scopeA);
                new APIProvider(scopeB);
                $rootScope.$digest();
                expect(a.getScopeByInstanceName('b')).toBe(scopeB);
            });

            it('ensure getScopeByName works after renaming', () => {
                let a = new APIUser(scopeA);
                new APIProvider(scopeB);
                $rootScope.$digest();
                expect(a.getScopeByInstanceName('b')).toBe(scopeB);
                scopeB.widget.instanceName = 'b2';
                scopeB.$digest();
                expect(a.getScopeByInstanceName('b2')).toBe(scopeB);
            });
        });
    });
});
