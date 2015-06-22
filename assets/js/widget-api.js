import angular from 'angular';

/**
 * @ngdoc module
 * @name app.widgetApi
 * @module app.widgetApi
 * @description
 * Services from this module are a public API for all the widget developers.
 * They are documented and are allowed to use.
 */
const widgetApi = angular.module('app.widgetApi', []);

/**
 * @ngdoc object
 * @name eventWires
 * @private
 * @description Map of emitter scope to array of event-to-slot wires
 * @returns {Object.<string, object>}
 */
widgetApi.constant('eventWires', new Map()); // emitterScope -> [{signalName, providerScope, slotName}]

/**
 * @ngdoc object
 * @name widgetSlots
 * @private
 * @description Mapping from providerScope to it's slot and slot's name
 * @returns {Object.<string, object>}
 */
widgetApi.constant('widgetSlots', new Map()); // providerScope -> [{slotName, fn}]

/**
 * @ngdoc object
 * @name instanceNameToScope
 * @private
 * @description Mapping from instance name to it's scope
 * @returns {Object.<string, object>}
 */
widgetApi.constant('instanceNameToScope', new Map()); // name -> scope

/**
 * @ngdoc object
 * @name autoWiredSlotsAndEvents
 * @private
 * @description Array of signa/slot/providerNames that
 * allows widget event auto-configuring api.
 */
widgetApi.constant('autoWiredSlotsAndEvents', []); // index -> {slotName, signalName, providerScope}

widgetApi.factory('APIProvider', function ($rootScope, $log,
                                           app, APIUser, pageSubscriptions,
                                           widgetSlots, instanceNameToScope,
                                           autoWiredSlotsAndEvents, eventWires) {
  /**
   * @class APIProvider
   * @description Injectable class
   * @param {$rootScope.Scope} scope Widget's scope
   * @param [scope.widget.instanceName] Widget's unique name
   */
  class APIProvider {
    constructor(scope) {
      this.scope = scope;
      instanceNameToScope.set(scope.widget.instanceName, scope);
      scope.$watch('widget.instanceName', (newName, oldName) => {
        if (newName !== oldName) {
          instanceNameToScope.set(newName, scope);
          instanceNameToScope.delete(oldName);
        }
      });

      widgetSlots.set(scope, []);

      APIProvider.updatePageSubscriptions();

      scope.$on('$destroy', () => {
        // clean widgetSlots
        widgetSlots.delete(scope);

        // clean autoWiredSlotsAndEvents
        for (let i = autoWiredSlotsAndEvents.length - 1; i >= 0; --i) {
          if (autoWiredSlotsAndEvents[i].providerScope === scope) {
            autoWiredSlotsAndEvents.splice(i, 1);
          }
        }

        // clean instanceNameToScope
        instanceNameToScope.delete(this.scope.widget.instanceName);
      });
    }

    /**
     * @description Provides a slot
     * @param {string} slotName Name of the slot
     * @param {Function} slot Slot function
     * @returns {APIProvider}
     */
    provide(slotName, fn) {
      if (typeof fn !== 'function') {
        throw `Second argument should be a function, ${typeof fn} passed instead`;
      }
      widgetSlots.get(this.scope).push({slotName, fn});
      return this;
    }

    /**
     * @description Provides a slot automatically called when widget is instantiated and
     * optionally when config was changed
     * @param {Function} slotFn
     * @param {boolean} enableReconfiguring
     * @returns {APIProvider}
     */
    config(slotFn, enableReconfiguring) {
      enableReconfiguring = enableReconfiguring === undefined ? true : enableReconfiguring;
      slotFn();
      if (enableReconfiguring) {
        this.provide(APIProvider.RECONFIG_SLOT, slotFn);
      }
      return this;
    }

    /**
     * @description Provides a slot which is
     * automatically called when widget config was changed
     * @param {Function} slotFn
     * @returns {APIProvider}
     */
    reconfig(slotFn) {
      this.provide(APIProvider.RECONFIG_SLOT, slotFn);
      return this;
    }

    /**
     * @description Provides possibility auto-wiring events with widget's slots.
     * @param {string} slotName Name of this widget's slot
     * @param {string} signalName Name of signal name; when this signal is emitted; slot `slotName` is called
     * @returns {APIProvider}
     */
    autoWireSlotWithEvent(slotName, signalName) {
      autoWiredSlotsAndEvents.push({
        slotName,
        signalName,
        providerScope: this.scope
      });
      return this;
    }

    /**
     * @description Provides a slot which is
     * automatically called when widget settings are opened
     * @param {Function} slotFn
     * @returns {APIProvider}
     */
    openCustomSettings(slotFn) {
      this.provide(APIProvider.OPEN_CUSTOM_SETTINGS_SLOT, slotFn);
      return this;
    }

    /**
     * @description Provides a slot automatically called when widget is removed by user
     * @param {Function} slotFn
     * @returns {APIProvider}
     */
    removal(slotFn) {
      this.provide(APIProvider.REMOVAL_SLOT, slotFn);
      return this;
    }

    /**
     * @private
     * @param emitterScope
     * @param signalName
     * @param providerScope
     * @param slotName
     */
    static wireSignalWithSlot(emitterScope, signalName, providerScope, slotName) {
      if (!emitterScope || !providerScope) {
        return;
      }
      const wire = eventWires.get(emitterScope) || [];
      wire.push({signalName, providerScope, slotName});
      eventWires.set(emitterScope, wire);
    }

    /**
     * @private
     * @param subscriptions
     */
    static updatePageSubscriptions() {
      $rootScope.$evalAsync(() => {
        const subscriptions = pageSubscriptions();
        eventWires.clear();

        if (!subscriptions) {
          return;
        }
        for (let s of subscriptions) {
          APIProvider.wireSignalWithSlot(
            APIUser.getScopeByInstanceName(s.emitter),
            s.signal,
            APIUser.getScopeByInstanceName(s.receiver),
            s.slot);
        }
      });
    }
  }

  APIProvider.RECONFIG_SLOT = 'RECONFIG_SLOT';
  APIProvider.REMOVAL_SLOT = 'DESTROY_SLOT';
  APIProvider.OPEN_CUSTOM_SETTINGS_SLOT = 'OPEN_CUSTOM_SETTINGS_SLOT';

  $rootScope.$watch(() => {
    const pageConf = app.pageConfig();
    return pageConf && pageConf.subscriptions;
  }, () => {
    APIProvider.updatePageSubscriptions();
  }, true);

  return APIProvider;
});

widgetApi.factory('APIUser', function (widgetSlots, instanceNameToScope) {
  /**
   * @class APIUser
   * @description Provides a class which allows to consume widget's
   * public API provided with `APIProvider`
   * @param scope Widget's scope
   */
  class APIUser {
    constructor(scope) {
      this.scope = scope;
    }

    /**
     * @private
     * @returns {string|undefined}
     */
    userName() {
      if (this.scope && this.scope.widget) {
        return this.scope.widget.instanceName;
      } else {
        return undefined;
      }
    }


    /**
     * Invokes widget's slot
     * @param providerName
     * @param slotName
     * @throws if widget doesn't provide this slot
     * @returns {*}
     */
    invoke(providerName, slotName, ...args) {
      const providerScope = APIUser.getScopeByInstanceName(providerName);
      if (!widgetSlots.has(providerScope)) {
        throw `Provider ${providerName} 434doesn't exist`;
      }
      for (let slot of widgetSlots.get(providerScope)) {
        if (slot.slotName === slotName) {
          return slot.fn.apply(undefined, [{
            emitterName: this.userName(),
            signalName: undefined
          }].concat(args));
        }
      }
      throw `Provider ${providerName} doesn't have slot called ${slotName}`;
    }

    /**
     * Invokes widget's slot
     * @param providerName
     * @param slotName
     * @returns {object} invocation
     * @returns {boolean} invocation.success - was slot found?
     * @returns {*} invocation.result - value returned by slot
     */
    tryInvoke(providerName, slotName) {
      try {
        return {
          success: true,
          result: this.invoke(providerName, slotName) // might throw
        };
      } catch (e) {
        if (typeof(e) === 'string' && e.indexOf('Provider') > -1) {
          return {
            success: false,
            result: undefined
          };
        } else {
          throw e;
        }
      }
    }

    /**
     * Invokes slot on all widgets
     * @param slotName Name of the slot
     */
    invokeAll(slotName, ...args) {
      for (let slots of widgetSlots.values()) {
        for (let slot of slots) {
          if (slot.slotName === slotName) {
            slot.fn.apply(undefined, [{
              emitterName: this.userName(),
              signalName: undefined
            }].concat(args));
          }
        }
      }
      return undefined;
    }

    /**
     * Returns registered scope by widget's name
     * @param name Widget's instanceName
     * @returns {$rootScope.Scope|undefined}
     */
    static getScopeByInstanceName(name) {
      return instanceNameToScope.get(name);
    }

    /**
     * WARNING: this is a deprecated method; use APIUser.getScopeByInstanceName instead
     * of this (APIUser.prototype.getScopeByInstanceName)
     * Returns registered scope by widget's name
     * @param name Widget's instanceName
     * @returns {$rootScope.Scope|undefined}
     */
    getScopeByInstanceName(name) {
      return APIUser.getScopeByInstanceName(name);
    }
  }

  return APIUser;
});

widgetApi.factory('EventEmitter', function ($log, $rootScope,
                                            eventWires, widgetSlots, autoWiredSlotsAndEvents,
                                            app, APIProvider) {
  /**
   * @class EventEmitter
   * @description Provides a class which allows to emit events which, in row, can invoke slots on other widgets
   * using publish/subscribe mechanism
   */
  class EventEmitter {
    constructor(scope) {
      this.scope = scope;

      APIProvider.updatePageSubscriptions();

      scope.$on('$destroy', () => {
        eventWires.delete(scope);
      });
    }

    /**
     * @private
     * @returns {string|undefined}
     */
    emitterName() {
      if (this.scope && this.scope.widget) {
        return this.scope.widget.instanceName;
      } else {
        return undefined;
      }
    }

    /**
     * Emit event
     * This automatically calls slots on all subscribed providers
     * Providers (widgets) can subscribe either using APIProvider.prototype.autoWireSlotWithEvent
     * or by user event wiring system.
     * @param signalName Name of the signal
     */
    emit(signalName, ...slotArgs) {
      $rootScope.$evalAsync(() => {
        const args = [{
          emitterName: this.emitterName(),
          signalName: signalName
        }].concat(slotArgs);

        for (let wire of autoWiredSlotsAndEvents) {
          if (wire.signalName === signalName) {

            const slots = widgetSlots.get(wire.providerScope);
            if (!slots) {
              continue;
            }

            for (let slot of slots) {
              if (!slot || slot.slotName !== wire.slotName) continue;
              slot.fn.apply(undefined, args);
            }
          }
        }

        if (!this.emitterName() || typeof this.emitterName() !== 'string') {
          $log.info(`Not emitting event through user event wiring system
            because widget's instanceName is not set`);
        }
        const wires = eventWires.get(this.scope);
        if (!wires) {
          return;
        }
        for (let wire of wires) {
          if (wire && wire.signalName === signalName) {

            const slots = widgetSlots.get(wire.providerScope);
            if (!slots) {
              continue;
            }

            for (let slot of slots) {
              if (!slot || slot.slotName !== wire.slotName) continue;
              slot.fn.apply(undefined, args);
            }
          }
        }
      });
    }
  }

  return EventEmitter;
});


/**
 * @ngdoc function
 * @name pageSubscriptions
 *
 * @description Injectable function which returns
 * a plain JavaScript array of subscriptions on the current page.
 * All the Array.prototype methods are available
 * @example
 * // To add one more subscription, inject pageSubscriptions and execute
 * pageSubscriptions().push({
   *   emitter: 'summator-master',
   *   receiver: 'summator-slave',
   *   signal: 'sumUpdated',
   *   slot: 'setValueOfA'
   * });
 *
 * @returns {Array}
 */
widgetApi.factory('pageSubscriptions', function (app) {
  return () => {
    const pageConf = app.pageConfig() || {};
    pageConf.subscriptions = pageConf.subscriptions || [];
    return pageConf.subscriptions;
  };
});

/**
 * @ngdoc function
 * @name pageWidgets
 *
 * @description Injectable function which returns
 * a plain JavaScript array of widgets
 * (their config objects containing at least `type` and `instanceName`)
 * on the current page.
 * All the Array.prototype methods are available on the returned result
 *
 * Please don't modify returned object!
 * @returns {Array}
 */
widgetApi.factory('pageWidgets', function (app) {
  return () => {
    const holders = app.pageConfig().holders;
    let widgets = [];
    for (let holderName in holders) {
      if (holders.hasOwnProperty(holderName)) {
        widgets = widgets.concat(holders[holderName].widgets);
      }
    }
    return widgets;
  };
});

widgetApi.factory('parentHolder', function (app) {
  return (widget) => {
    const holders = app.pageConfig().holders;
    for (let holderName in holders) {
      if (holders.hasOwnProperty(holderName)) {
        const holder = holders[holderName];
        if (holder.widgets.find(w => w.instanceName === widget.instanceName)) {
          return holder;
        }
      }
    }
  };
});
