// These requirejs modules are needed because
// app-config module is generated inline in app view by back-end.
define('app-config', ['angular'], function (angular) {
  angular.module('app.config', [])
    .constant('appName', "test")
    .constant('appId', "507f1f77bcf86cd799439011") // random 12 byte number
    .constant('initialConfig', {"pages": []});
});

define('user', ['angular'], function (angular) {
  angular.module('app.user', []).constant('user', {});
});

define('author', ['angular'], function (angular) {
  angular.module('app.author', []).constant('author', {});
});

define(['app', 'angular-mocks'], () => {
  let noWidgetsJson = {};

  let $httpBackend, $provide, $translateProvider;

  beforeEach(module('app', (_$provide_, _$translateProvider_) => {
    $provide = _$provide_;
    $translateProvider = _$translateProvider_;

    $provide.factory('unitTestLanguageLoader', ($q) =>
      () => {
        const deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      }
    );

    $translateProvider.useLoader('unitTestLanguageLoader');
  }));

  beforeEach(inject((_$httpBackend_) => {
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET('/widgets/widgets.json')
      .respond(JSON.stringify(noWidgetsJson));
  }));

  describe("Test ES6 polyfill/support is present", () => {
    it("ES6 Map class is present", () => {
      const q = new Map();
      expect(q.size).toBe(0);
      const fn1 = () => 9;
      const fn2 = () => 15;
      q.set(fn1, fn2);
      expect(q.size).toBe(1);
      expect(q.get(fn1)()).toBe(15);
    });
  });

  describe("Testing controllers", () => {
    let MainControllerScope;
    let $controller;
    beforeEach(inject((_$controller_, $rootScope) => {
      $controller = _$controller_;
      MainControllerScope = $rootScope.$new();
    }));

    it('ensure MainController exists and works', () => {
      $controller('MainController', {$scope: MainControllerScope});
      expect(MainControllerScope).toBeDefined();
      MainControllerScope.alertAppConfigSubmissionFailed({
        data: {
          status: 404,
          statusText: 'Page not found'
        }
      });
    });
  });

  describe("Services", () => {
    // todo: fix tests
    xdescribe("widgets service", () => {
      let $rootScope;
      let scopeA;
      let scopeB;
      let scopeC;
      let widgetSlots;
      let APIProvider;
      let APIUser;
      let EventEmitter;
      let instanceNameToScope;
      beforeEach(inject((_$rootScope_, _widgetSlots_, _APIProvider_,
                         _APIUser_, _EventEmitter_, _instanceNameToScope_) => {
        $rootScope = _$rootScope_;
        widgetSlots = _widgetSlots_;
        APIProvider = _APIProvider_;
        APIUser = _APIUser_;
        EventEmitter = _EventEmitter_;
        instanceNameToScope = _instanceNameToScope_;
        expect(instanceNameToScope.size).toBe(0);
        scopeA = $rootScope.$new();
        scopeB = $rootScope.$new();
        scopeC = $rootScope.$new();
        scopeA.widget = {instanceName: "a"};
        scopeB.widget = {instanceName: "b"};
        scopeC.widget = {instanceName: "c"};

        expect(instanceNameToScope.size).toBe(0);
      }));

      afterEach(() => {
        scopeA.$destroy();
        scopeB.$destroy();
        scopeC.$destroy();
        expect(instanceNameToScope.size).toBe(0);
      });

      it('should correctly clean-up widgetSlots when scope is destroyed', () => {
        const a = new APIProvider(scopeA);
        a.provide('slot', angular.noop);
        expect(widgetSlots.size).toEqual(1);
        scopeA.$destroy();
        expect(widgetSlots.size).toEqual(0);
      });

      it('slot handlers should be called with correct evt object', () => {
        const a = new EventEmitter(scopeA);
        const b = new APIProvider(scopeB);
        $rootScope.$digest();
        const slot = jasmine.createSpy('slot');
        b.provide('slot', slot);
        APIProvider.wireSignalWithSlot(scopeA, 'hello', scopeB, 'slot');
        a.emit('hello');
        $rootScope.$digest();
        expect(slot).toHaveBeenCalledWith({
          emitterName: 'a',
          signalName: 'hello'
        });
      });

      it('slot handlers should be called with correct arguments', () => {
        const a = new EventEmitter(scopeA);
        const b = new APIProvider(scopeB);
        $rootScope.$digest();
        const slot = jasmine.createSpy('slot');
        b.provide('slot', slot);
        APIProvider.wireSignalWithSlot(scopeA, 'hello', scopeB, 'slot');
        a.emit('hello', 123);
        $rootScope.$digest();
        expect(slot).toHaveBeenCalledWith({
          emitterName: 'a',
          signalName: 'hello'
        }, 123);
      });

      it('ensure APIUser::invoke calls', () => {
        const a = new APIUser(scopeA);
        const b = new APIProvider(scopeB);
        const slot = jasmine.createSpy('slot').and.returnValue(1234);
        b.provide('slot', slot);
        expect(widgetSlots.get(scopeB)[0]).not.toBeUndefined();
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
        const a = new APIUser(scopeA);
        const b = new APIProvider(scopeB);
        const slot = jasmine.createSpy('slot').and.returnValue(1234);
        b.provide('slot', slot);
        const okInvocation = a.tryInvoke('b', 'slot');
        expect(okInvocation.success).toBe(true);
        expect(okInvocation.result).toBe(1234);
        expect(slot).toHaveBeenCalledWith({
          emitterName: 'a',
          signalName: undefined
        });
        const badInvocation = a.tryInvoke('b', 'non-existing-slot');
        expect(badInvocation.success).toBe(false);
        expect(badInvocation.result).toBeUndefined();
      });

      it('ensure APIUser::invokeAll calls', () => {
        const aUser = new APIUser(scopeA);
        const aProvider = new APIProvider(scopeA);
        const bUser = new APIUser(scopeB);
        const bProvider = new APIProvider(scopeB);
        const slotA = jasmine.createSpy('slotA').and.returnValue(1);
        const slotB = jasmine.createSpy('slotB').and.returnValue(2);
        const slotOther = jasmine.createSpy('slotOther').and.returnValue(3);
        bProvider.provide('slot', slotB);
        aUser.invokeAll('slot');
        expect(slotB).toHaveBeenCalledWith({
          emitterName: 'a',
          signalName: undefined
        });
        aProvider.provide('slot', slotA);
        bUser.invokeAll('slot');
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
        expect(instanceNameToScope.size).toBe(0);
        const a = new APIUser(scopeA);
        expect(instanceNameToScope.size).toBe(0);
        new APIProvider(scopeB);
        expect(instanceNameToScope.size).toBe(1);
        $rootScope.$digest();
        expect(a.getScopeByInstanceName('b')).toBe(scopeB);
        expect(APIUser.getScopeByInstanceName('b')).toBe(scopeB);
      });

      it('ensure getScopeByName works after renaming', () => {
        const a = new APIUser(scopeA);
        new APIProvider(scopeB);
        $rootScope.$digest();
        expect(a.getScopeByInstanceName('b')).toBe(scopeB);
        scopeB.widget.instanceName = 'b2';
        scopeB.$digest();
        expect(a.getScopeByInstanceName('b2')).toBe(scopeB);
        expect(APIUser.getScopeByInstanceName('b2')).toBe(scopeB);
      });

      it('ensure autoWireSlotWithEvent works', () => {
        const a = new EventEmitter(scopeA);
        const b = new APIProvider(scopeB);
        $rootScope.$digest();
        const slotB1 = jasmine.createSpy('slotB1');
        const slotB2 = jasmine.createSpy('slotB2');
        b.provide('slot-name', slotB1);
        b.autoWireSlotWithEvent('slot-name', 'signal-name');
        a.emit('signal-name', 1234);
        $rootScope.$digest();
        expect(slotB1).toHaveBeenCalled();
        expect(slotB2).not.toHaveBeenCalled();
      });
    });
  });
});
