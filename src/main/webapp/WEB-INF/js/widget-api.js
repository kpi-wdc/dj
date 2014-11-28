define(['angular'], function (angular) {
    "use strict";
    var widgetApi = angular.module('app.widgetApi', []);

    widgetApi.constant('eventWires', {}); // emitterName -> [{signalName, providerName, slotName}]
    widgetApi.constant('widgetSlots', {}); // providerName -> [{slotName, fn}]

    widgetApi.factory('APIProvider', function (widgetSlots) {
        var APIProvider = function (scope) {
            var self = this;
            var providerName = function () {
                return scope && scope.widget && scope.widget.instanceName;
            };
            scope.$on('$destroy', function () {
                delete widgetSlots[providerName()];
            });

            this.provide = function (slotName, slot) {
                if (typeof slot !== 'function') {
                    throw "Second argument should be a function, " +
                    (typeof slot) + "passed instead";
                }
                widgetSlots[providerName()] = widgetSlots[providerName()] || [];
                widgetSlots[providerName()].push({
                    slotName: slotName,
                    fn: slot
                });
                return this;
            };

            this.config = function (slotFn, enableReconfiguring) {
                enableReconfiguring = enableReconfiguring === undefined ? true : enableReconfiguring;
                slotFn();
                if (enableReconfiguring) {
                    self.provide(APIProvider.RECONFIG_SLOT, slotFn);
                }
                return this;
            };

            this.reconfig = function (slotFn) {
                self.provide(APIProvider.RECONFIG_SLOT, slotFn);
                return this;
            };

            this.destroy = function (slotFn) {
                self.provide(APIProvider.DESTROY_SLOT, slotFn);
                return this;
            };
        };

        APIProvider.RECONFIG_SLOT = 'RECONFIG_SLOT';
        APIProvider.DESTROY_SLOT = 'DESTROY_SLOT';
        return APIProvider;
    });

    widgetApi.factory('APIUser', function (widgetSlots) {
        return function (scope) {
            var userName = function () {
                return scope && scope.widget && scope.widget.instanceName;
            };

            this.invoke = function (providerName, slotName) {
                if (!widgetSlots[providerName]) {
                    throw "Provider " + providerName + " doesn't exist";
                }
                for (var i = 0; i < widgetSlots[providerName].length; i++) {
                    var slot = widgetSlots[providerName][i];
                    if (slot.slotName === slotName) {
                        return slot.fn.apply(undefined, [{
                            emitterName: userName(),
                            signalName: undefined
                        }].concat(Array.prototype.slice.call(arguments, 2)));
                    }
                }
                throw "Provider " + providerName + " doesn't have slot called " + slotName;
            };

            this.tryInvoke = function (providerName, slotName) {
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

            this.invokeAll = function (slotName) {
                var called = false;
                for (var providerName in widgetSlots) {
                    if (widgetSlots.hasOwnProperty(providerName)) {
                        for (var i = 0; i < widgetSlots[providerName].length; i++) {
                            var slot = widgetSlots[providerName][i];
                            if (slot.slotName === slotName) {
                                called = true;
                                slot.fn.apply(undefined, [{
                                    emitterName: userName(),
                                    signalName: undefined
                                }].concat(Array.prototype.slice.call(arguments, 2)));
                            }
                        }
                    }
                }
                return undefined;
            }
        };
    });

    widgetApi.factory('EventEmitter', function (eventWires, widgetSlots, $log, $timeout, $rootScope) {
        var EventPublisher = function (scope) {
            var emitterName = function () {
                return scope && scope.widget && scope.widget.instanceName;
            };

            this.emit = function (signalName) {
                var args = Array.prototype.slice.call(arguments, 1);

                $rootScope.$evalAsync(function () {
                    if (!emitterName() || typeof emitterName() !== "string") {
                        $log.info("Not emitting event because widget's instanceName is not set");
                    }
                    var wires = eventWires[emitterName()];
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
                                    emitterName: emitterName(),
                                    signalName: signalName
                                }].concat(args));
                            }
                        }
                    }
                });
            };
        };

        EventPublisher.wireSignalWithSlot = function (emitterName, signalName, provideName, slotName) {
            eventWires[emitterName] = eventWires[emitterName] || [];
            eventWires[emitterName].push({
                signalName: signalName,
                providerName: provideName,
                slotName: slotName
            });
        };

        EventPublisher.replacePageSubscriptions = function (subsriptions) {
            for (var emitterName in eventWires) {
                if (eventWires.hasOwnProperty(emitterName)) {
                    delete eventWires[emitterName];
                }
            }

            if (!subsriptions) {
                return;
            }
            for (var i = 0; i < subsriptions.length; i++) {
                var s = subsriptions[i];
                EventPublisher.wireSignalWithSlot(s.emitter, s.signal, s.receiver, s.slot);
            }
        };

        return EventPublisher;
    });
});
