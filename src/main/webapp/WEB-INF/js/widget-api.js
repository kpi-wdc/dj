define(['angular'], function (angular) {
    /**
     * @ngdoc module
     * @name app.widgetApi
     * @module app.widgetApi
     * @description
     * Services from this module are a public API for all the widget developers.
     * They are documented and are allowed to use.
     */
    let widgetApi = angular.module('app.widgetApi', []);

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
        class APIProvider {
            constructor(scope) {
                let self = this;
                this.providerName = scope.widget.instanceName;
                instanceNameToScope[this.providerName] = scope;
                scope.$watch('widget.instanceName', (newName) => {
                    if (newName === self.providerName) {
                        return;
                    }
                    widgetSlots[newName] = widgetSlots[self.providerName];
                    delete widgetSlots[self.providerName];

                    instanceNameToScope[newName] = scope;
                    delete instanceNameToScope[self.providerName];

                    self.providerName = newName;
                });
                scope.$on('$destroy', () => {
                    delete widgetSlots[self.providerName];
                });
            }

            /**
             * @description Provides a slot
             * @param {string} slotName Name of the slot
             * @param {Function} slot Slot function
             * @returns {APIProvider}
             */
            provide(slotName, slot) {
                if (typeof slot !== 'function') {
                    throw `Second argument should be a function, ${typeof slot} passed instead`;
                }
                widgetSlots[this.providerName] = widgetSlots[this.providerName] || [];
                widgetSlots[this.providerName].push({
                    slotName: slotName,
                    fn: slot
                });
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
        }

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
            };

            /**
             * Invokes widget's slot
             * @param providerName
             * @param slotName
             * @throws if widget doesn't provide this slot
             * @returns {*}
             */
            invoke(providerName, slotName) {
                if (!widgetSlots[providerName]) {
                    throw `Provider ${providerName} doesn't exist`;
                }
                for (let i = 0; i < widgetSlots[providerName].length; i++) {
                    let slot = widgetSlots[providerName][i];
                    if (slot.slotName === slotName) {
                        return slot.fn.apply(undefined, [{
                            emitterName: this.userName(),
                            signalName: undefined
                        }].concat(Array.prototype.slice.call(arguments, 2)));
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
            }

            /**
             * Invokes slot on all widgets
             * @param slotName Name of the slot
             */
            invokeAll(slotName) {
                let called = false;
                for (let providerName in widgetSlots) {
                    if (widgetSlots.hasOwnProperty(providerName)) {
                        for (let slot of widgetSlots[providerName]) {
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
            }

            /**
             * Returns registered scope by widget's name
             * @param name Widget's instanceName
             * @returns {$rootScope.Scope|undefined}
             */
            getScopeByInstanceName(name) {
                return instanceNameToScope[name];
            }
        }

        return APIUser;
    });

    widgetApi.factory('EventEmitter', function (eventWires, widgetSlots, $log, $timeout, $rootScope, appConfig) {
        /**
         * @class EventEmitter
         * @description Provides a class which allows to emit events which, in row, can invoke slots on other widgets
         * using publish/subscribe mechanism
         */
        class EventPublisher {
            constructor(scope) {
                this.scope = scope;
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
             * @param signalName Name of the signal
             */
            emit(signalName) {
                let args = Array.prototype.slice.call(arguments, 1);
                $rootScope.$evalAsync(() => {
                    if (!this.emitterName() || typeof this.emitterName() !== "string") {
                        $log.info("Not emitting event because widget's instanceName is not set");
                    }
                    let wires = eventWires[this.emitterName()];
                    if (!wires) {
                        return;
                    }
                    for (let i = 0; i < wires.length; i++) {
                        let wire = wires[i];
                        if (wire && wire.signalName === signalName) {

                            let slots = widgetSlots[wire.providerName];
                            if (!slots) {
                                continue;
                            }

                            for (let j = 0; j < slots.length; j++) {
                                if (!slots[j] || slots[j].slotName !== wire.slotName) continue;
                                slots[j].fn.apply(undefined, [{
                                    emitterName: this.emitterName(),
                                    signalName: signalName
                                }].concat(args));
                            }
                        }
                    }
                });
            }

            /**
             * @private
             * @param emitterName
             * @param signalName
             * @param provideName
             * @param slotName
             */
             static wireSignalWithSlot(emitterName, signalName, provideName, slotName) {
                eventWires[emitterName] = eventWires[emitterName] || [];
                eventWires[emitterName].push({
                    signalName: signalName,
                    providerName: provideName,
                    slotName: slotName
                });
            }

            /**
             * @private
             * @param subscriptions
             */
            static replacePageSubscriptions(subscriptions) {
                for (let emitterName in eventWires) {
                    if (eventWires.hasOwnProperty(emitterName)) {
                        delete eventWires[emitterName];
                    }
                }

                if (!subscriptions) {
                    return;
                }
                for (let s of subscriptions) {
                    EventPublisher.wireSignalWithSlot(s.emitter, s.signal, s.receiver, s.slot);
                }
            }
        }

        $rootScope.$watch(() => {
            let pageConf = appConfig.pageConfig();
            return  pageConf && pageConf.subscriptions;
        }, (newSubscriptions) => {
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
        return () => {
            let pageConf = appConfig.pageConfig();
            pageConf.subscriptions = pageConf.subscriptions || [];
            return pageConf.subscriptions;
        };
    });
});
