define(['angular'], function (angular) {
    "use strict";
    /**
     * @ngdoc module
     * @name app.widgetApi
     * @module app.widgetApi
     * @description
     * Services from this module are a public API for all the widget developers.
     * They are documented and are allowed to use.
     */
    var widgetApi = angular.module('app.widgetApi', []);

    /**
     * @ngdoc object
     * @name eventWires
     * @description Array of event-to-slot wires
     * @returns {Object.<string, object>}
     */
    widgetApi.constant('eventWires', {}); // emitterName -> [{signalName, providerName, slotName}]

    /**
     * @ngdoc object
     * @name widgetSlots
     * @description Mapping from providerName to it's slot and slot's name
     * @returns {Object.<string, object>}
     */
    widgetApi.constant('widgetSlots', {}); // providerName -> [{slotName, fn}]

    /**
     * @ngdoc object
     * @name instanceNameToScope
     * @description Mapping from instance name to it's scope
     * @returns {Object.<string, object>}
     */
    widgetApi.constant('instanceNameToScope', {}); // name -> scope

    widgetApi.factory('APIProvider', function (widgetSlots, instanceNameToScope) {
        /**
         * @class APIProvider
         * @description Injectable class
         * @param {$rootScope.Scope} scope Widget's scope
         * @param [scope.widget.instanceName] Widget's unique name
         */
        var APIProvider = function (scope) {
            var self = this;
            this.providerName = scope.widget.instanceName;
            instanceNameToScope[this.providerName] = scope;
            scope.$watch('widget.instanceName', function (newName) {
                if (newName === self.providerName) {
                    return;
                }
                widgetSlots[newName] = widgetSlots[self.providerName];
                delete widgetSlots[self.providerName];

                instanceNameToScope[newName] = scope;
                delete instanceNameToScope[self.providerName];

                self.providerName = newName;
            });
            scope.$on('$destroy', function () {
                delete widgetSlots[self.providerName];
            });
        };

        /**
         * @description Provides a slot
         * @param {string} slotName Name of the slot
         * @param {Function} slot Slot function
         * @returns {APIProvider}
         */
        APIProvider.prototype.provide = function (slotName, slot) {
            if (typeof slot !== 'function') {
                throw "Second argument should be a function, " +
                (typeof slot) + "passed instead";
            }
            widgetSlots[this.providerName] = widgetSlots[this.providerName] || [];
            widgetSlots[this.providerName].push({
                slotName: slotName,
                fn: slot
            });
            return this;
        };

        /**
         * @description Provides a slot automatically called when widget is instantiated and
         * optionally when config was changed
         * @param {Function} slotFn
         * @param {boolean} enableReconfiguring
         * @returns {APIProvider}
         */
        APIProvider.prototype.config = function (slotFn, enableReconfiguring) {
            enableReconfiguring = enableReconfiguring === undefined ? true : enableReconfiguring;
            slotFn();
            if (enableReconfiguring) {
                this.provide(APIProvider.RECONFIG_SLOT, slotFn);
            }
            return this;
        };

        /**
         * @description Provides a slot which is
         * automatically called when widget config was changed
         * @param {Function} slotFn
         * @returns {APIProvider}
         */
        APIProvider.prototype.reconfig = function (slotFn) {
            this.provide(APIProvider.RECONFIG_SLOT, slotFn);
            return this;
        };

        /**
         * @description Provides a slot which is
         * automatically called when widget settings are opened
         * @param {Function} slotFn
         * @returns {APIProvider}
         */
        APIProvider.prototype.openCustomSettings = function (slotFn) {
            this.provide(APIProvider.OPEN_CUSTOM_SETTINGS_SLOT, slotFn);
            return this;
        };

        /**
         * @description Provides a slot automatically called when widget is removed by user
         * @param {Function} slotFn
         * @returns {APIProvider}
         */
        APIProvider.prototype.removal = function (slotFn) {
            this.provide(APIProvider.REMOVAL_SLOT, slotFn);
            return this;
        };

        APIProvider.RECONFIG_SLOT = 'RECONFIG_SLOT';
        APIProvider.REMOVAL_SLOT = 'DESTROY_SLOT';
        APIProvider.OPEN_CUSTOM_SETTINGS_SLOT = 'OPEN_CUSTOM_SETTINGS_SLOT';
        return APIProvider;
    });

    widgetApi.factory('APIUser', function (widgetSlots, instanceNameToScope) {
        /**
         * @class APIUser
         * @description Provides a class which allows to consume widget's
         * public API provided with `APIProvider`
         * @param scope Widget's scope
         */
        var APIUser =  function (scope) {
            this.scope = scope;
        };

        /**
         * @private
         * @returns {string|undefined}
         */
        APIUser.prototype.userName = function () {
            if (this.scope && this.scope.widget) {
                return this.scope.widget.instanceName;
            } else {
                return undefined;
            }
        };

        /**
         * Invokes widget's slot
         * @param providerName
         * @param slotName
         * @throws if widget doesn't provide this slot
         * @returns {*}
         */
        APIUser.prototype.invoke = function (providerName, slotName) {
            if (!widgetSlots[providerName]) {
                throw "Provider " + providerName + " doesn't exist";
            }
            for (var i = 0; i < widgetSlots[providerName].length; i++) {
                var slot = widgetSlots[providerName][i];
                if (slot.slotName === slotName) {
                    return slot.fn.apply(undefined, [{
                        emitterName: this.userName(),
                        signalName: undefined
                    }].concat(Array.prototype.slice.call(arguments, 2)));
                }
            }
            throw "Provider " + providerName + " doesn't have slot called " + slotName;
        };

        /**
         * Invokes widget's slot
         * @param providerName
         * @param slotName
         * @returns {object} invocation
         * @returns {boolean} invocation.success - was slot found?
         * @returns {*} invocation.result - value returned by slot
         */
        APIUser.prototype.tryInvoke = function (providerName, slotName) {
            try {
                return {
                    success: true,
                    result: this.invoke(providerName, slotName) // might throw
                }
            } catch (e) {
                if (typeof(e) === 'string' && e.indexOf("Provider") > -1) {
                    return {
                        success: false,
                        result: undefined
                    }
                } else {
                    throw e;
                }
            }
        };

        /**
         * Invokes slot on all widgets
         * @param slotName Name of the slot
         */
        APIUser.prototype.invokeAll = function (slotName) {
            var called = false;
            for (var providerName in widgetSlots) {
                if (widgetSlots.hasOwnProperty(providerName)) {
                    for (var i = 0; i < widgetSlots[providerName].length; i++) {
                        var slot = widgetSlots[providerName][i];
                        if (slot.slotName === slotName) {
                            called = true;
                            slot.fn.apply(undefined, [{
                                emitterName: this.userName(),
                                signalName: undefined
                            }].concat(Array.prototype.slice.call(arguments, 2)));
                        }
                    }
                }
            }
            return undefined;
        };

        /**
         * Returns registered scope by widget's name
         * @param name Widget's instanceName
         * @returns {$rootScope.Scope|undefined}
         */
        APIUser.prototype.getScopeByInstanceName = function (name) {
            return instanceNameToScope[name];
        };

        return APIUser;
    });

    widgetApi.factory('EventEmitter', function (eventWires, widgetSlots, $log, $timeout, $rootScope, appConfig) {
        /**
         * @class EventEmitter
         * @description Provides a class which allows to emit events which, in row, can invoke slots on other widgets
         * using publish/subscribe mechanism
         */
        var EventPublisher = function (scope) {
            this.scope = scope;
        };

        /**
         * @private
         * @returns {string|undefined}
         */
        EventPublisher.prototype.emitterName = function () {
            if (this.scope && this.scope.widget) {
                return this.scope.widget.instanceName;
            } else {
                return undefined;
            }
        };

        /**
         * Emit event
         * This automatically calls slots on all subscribed providers
         * @param signalName Name of the signal
         */
        EventPublisher.prototype.emit = function (signalName) {
            var args = Array.prototype.slice.call(arguments, 1);
            var self = this;
            $rootScope.$evalAsync(function () {
                if (!self.emitterName() || typeof self.emitterName() !== "string") {
                    $log.info("Not emitting event because widget's instanceName is not set");
                }
                var wires = eventWires[self.emitterName()];
                if (!wires) {
                    return;
                }
                for (var i = 0; i < wires.length; i++) {
                    var wire = wires[i];
                    if (wire && wire.signalName === signalName) {

                        var slots = widgetSlots[wire.providerName];
                        if (!slots) {
                            continue;
                        }

                        for (var j = 0; j < slots.length; j++) {
                            if (!slots[j] || slots[j].slotName !== wire.slotName) continue;
                            slots[j].fn.apply(undefined, [{
                                emitterName: self.emitterName(),
                                signalName: signalName
                            }].concat(args));
                        }
                    }
                }
            });
        };

        /**
         * @private
         * @param emitterName
         * @param signalName
         * @param provideName
         * @param slotName
         */
        EventPublisher.wireSignalWithSlot = function (emitterName, signalName, provideName, slotName) {
            eventWires[emitterName] = eventWires[emitterName] || [];
            eventWires[emitterName].push({
                signalName: signalName,
                providerName: provideName,
                slotName: slotName
            });
        };

        /**
         * @private
         * @param subscriptions
         */
        EventPublisher.replacePageSubscriptions = function (subscriptions) {
            for (var emitterName in eventWires) {
                if (eventWires.hasOwnProperty(emitterName)) {
                    delete eventWires[emitterName];
                }
            }

            if (!subscriptions) {
                return;
            }
            for (var i = 0; i < subscriptions.length; i++) {
                var s = subscriptions[i];
                EventPublisher.wireSignalWithSlot(s.emitter, s.signal, s.receiver, s.slot);
            }
        };

        $rootScope.$watch(function () {
            var pageConf = appConfig.pageConfig();
            return  pageConf && pageConf.subscriptions;
        }, function (newSubscriptions) {
            EventPublisher.replacePageSubscriptions(newSubscriptions);
        }, true);

        return EventPublisher;
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
     *   emitter: "summator-master",
     *   receiver: "summator-slave",
     *   signal: "sumUpdated",
     *   slot: "setValueOfA"
     * });
     *
     * @returns {Array}
     */
    widgetApi.factory('pageSubscriptions', function (appConfig) {
        return function () {
            var pageConf = appConfig.pageConfig();
            pageConf.subscriptions = pageConf.subscriptions || [];
           return pageConf.subscriptions;
        };
    });
});
