define(function () {
    // ES5 Function.prototype.bind
    // doesn't work in pre-v2 PhantomJS
    if (typeof Function.prototype.bind != 'function') {
        Function.prototype.bind = (function () {
            var slice = Array.prototype.slice;
            return function (thisArg) {
                var target = this, boundArgs = slice.call(arguments, 1);

                if (typeof target != 'function') throw new TypeError();

                function Bound() {
                    var args = boundArgs.concat(slice.call(arguments));
                    target.apply(this instanceof Bound ? this : thisArg, args);
                }

                Bound.prototype = (function F(proto) {
                    proto && (F.prototype = proto);
                    if (!(this instanceof F)) return new F;
                })(target.prototype);

                return Bound;
            };
        })();
    }
});
