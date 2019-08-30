// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../node_modules/core-js/modules/_global.js":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"../../../../node_modules/core-js/modules/_core.js":[function(require,module,exports) {
var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"../../../../node_modules/core-js/modules/_is-object.js":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"../../../../node_modules/core-js/modules/_an-object.js":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"../../../../node_modules/core-js/modules/_is-object.js"}],"../../../../node_modules/core-js/modules/_fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"../../../../node_modules/core-js/modules/_descriptors.js":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"../../../../node_modules/core-js/modules/_fails.js"}],"../../../../node_modules/core-js/modules/_dom-create.js":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"../../../../node_modules/core-js/modules/_is-object.js","./_global":"../../../../node_modules/core-js/modules/_global.js"}],"../../../../node_modules/core-js/modules/_ie8-dom-define.js":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"../../../../node_modules/core-js/modules/_descriptors.js","./_fails":"../../../../node_modules/core-js/modules/_fails.js","./_dom-create":"../../../../node_modules/core-js/modules/_dom-create.js"}],"../../../../node_modules/core-js/modules/_to-primitive.js":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"../../../../node_modules/core-js/modules/_is-object.js"}],"../../../../node_modules/core-js/modules/_object-dp.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"../../../../node_modules/core-js/modules/_an-object.js","./_ie8-dom-define":"../../../../node_modules/core-js/modules/_ie8-dom-define.js","./_to-primitive":"../../../../node_modules/core-js/modules/_to-primitive.js","./_descriptors":"../../../../node_modules/core-js/modules/_descriptors.js"}],"../../../../node_modules/core-js/modules/_property-desc.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"../../../../node_modules/core-js/modules/_hide.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"../../../../node_modules/core-js/modules/_object-dp.js","./_property-desc":"../../../../node_modules/core-js/modules/_property-desc.js","./_descriptors":"../../../../node_modules/core-js/modules/_descriptors.js"}],"../../../../node_modules/core-js/modules/_has.js":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"../../../../node_modules/core-js/modules/_uid.js":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"../../../../node_modules/core-js/modules/_library.js":[function(require,module,exports) {
module.exports = false;

},{}],"../../../../node_modules/core-js/modules/_shared.js":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"../../../../node_modules/core-js/modules/_core.js","./_global":"../../../../node_modules/core-js/modules/_global.js","./_library":"../../../../node_modules/core-js/modules/_library.js"}],"../../../../node_modules/core-js/modules/_function-to-string.js":[function(require,module,exports) {
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":"../../../../node_modules/core-js/modules/_shared.js"}],"../../../../node_modules/core-js/modules/_redefine.js":[function(require,module,exports) {

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_global":"../../../../node_modules/core-js/modules/_global.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js","./_has":"../../../../node_modules/core-js/modules/_has.js","./_uid":"../../../../node_modules/core-js/modules/_uid.js","./_function-to-string":"../../../../node_modules/core-js/modules/_function-to-string.js","./_core":"../../../../node_modules/core-js/modules/_core.js"}],"../../../../node_modules/core-js/modules/_a-function.js":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"../../../../node_modules/core-js/modules/_ctx.js":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"../../../../node_modules/core-js/modules/_a-function.js"}],"../../../../node_modules/core-js/modules/_export.js":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"../../../../node_modules/core-js/modules/_global.js","./_core":"../../../../node_modules/core-js/modules/_core.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js","./_redefine":"../../../../node_modules/core-js/modules/_redefine.js","./_ctx":"../../../../node_modules/core-js/modules/_ctx.js"}],"../../../../node_modules/core-js/modules/_user-agent.js":[function(require,module,exports) {

var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":"../../../../node_modules/core-js/modules/_global.js"}],"../../../../node_modules/core-js/modules/web.timers.js":[function(require,module,exports) {

// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_global":"../../../../node_modules/core-js/modules/_global.js","./_export":"../../../../node_modules/core-js/modules/_export.js","./_user-agent":"../../../../node_modules/core-js/modules/_user-agent.js"}],"../../../../node_modules/core-js/modules/_invoke.js":[function(require,module,exports) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],"../../../../node_modules/core-js/modules/_html.js":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"../../../../node_modules/core-js/modules/_global.js"}],"../../../../node_modules/core-js/modules/_cof.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"../../../../node_modules/core-js/modules/_task.js":[function(require,module,exports) {


var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_ctx":"../../../../node_modules/core-js/modules/_ctx.js","./_invoke":"../../../../node_modules/core-js/modules/_invoke.js","./_html":"../../../../node_modules/core-js/modules/_html.js","./_dom-create":"../../../../node_modules/core-js/modules/_dom-create.js","./_global":"../../../../node_modules/core-js/modules/_global.js","./_cof":"../../../../node_modules/core-js/modules/_cof.js"}],"../../../../node_modules/core-js/modules/web.immediate.js":[function(require,module,exports) {
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":"../../../../node_modules/core-js/modules/_export.js","./_task":"../../../../node_modules/core-js/modules/_task.js"}],"../../../../node_modules/core-js/modules/_wks.js":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"../../../../node_modules/core-js/modules/_shared.js","./_uid":"../../../../node_modules/core-js/modules/_uid.js","./_global":"../../../../node_modules/core-js/modules/_global.js"}],"../../../../node_modules/core-js/modules/_add-to-unscopables.js":[function(require,module,exports) {
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_wks":"../../../../node_modules/core-js/modules/_wks.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js"}],"../../../../node_modules/core-js/modules/_iter-step.js":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"../../../../node_modules/core-js/modules/_iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"../../../../node_modules/core-js/modules/_iobject.js":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"../../../../node_modules/core-js/modules/_cof.js"}],"../../../../node_modules/core-js/modules/_defined.js":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"../../../../node_modules/core-js/modules/_to-iobject.js":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"../../../../node_modules/core-js/modules/_iobject.js","./_defined":"../../../../node_modules/core-js/modules/_defined.js"}],"../../../../node_modules/core-js/modules/_to-integer.js":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"../../../../node_modules/core-js/modules/_to-length.js":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"../../../../node_modules/core-js/modules/_to-integer.js"}],"../../../../node_modules/core-js/modules/_to-absolute-index.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"../../../../node_modules/core-js/modules/_to-integer.js"}],"../../../../node_modules/core-js/modules/_array-includes.js":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"../../../../node_modules/core-js/modules/_to-iobject.js","./_to-length":"../../../../node_modules/core-js/modules/_to-length.js","./_to-absolute-index":"../../../../node_modules/core-js/modules/_to-absolute-index.js"}],"../../../../node_modules/core-js/modules/_shared-key.js":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"../../../../node_modules/core-js/modules/_shared.js","./_uid":"../../../../node_modules/core-js/modules/_uid.js"}],"../../../../node_modules/core-js/modules/_object-keys-internal.js":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"../../../../node_modules/core-js/modules/_has.js","./_to-iobject":"../../../../node_modules/core-js/modules/_to-iobject.js","./_array-includes":"../../../../node_modules/core-js/modules/_array-includes.js","./_shared-key":"../../../../node_modules/core-js/modules/_shared-key.js"}],"../../../../node_modules/core-js/modules/_enum-bug-keys.js":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"../../../../node_modules/core-js/modules/_object-keys.js":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"../../../../node_modules/core-js/modules/_object-keys-internal.js","./_enum-bug-keys":"../../../../node_modules/core-js/modules/_enum-bug-keys.js"}],"../../../../node_modules/core-js/modules/_object-dps.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"../../../../node_modules/core-js/modules/_object-dp.js","./_an-object":"../../../../node_modules/core-js/modules/_an-object.js","./_object-keys":"../../../../node_modules/core-js/modules/_object-keys.js","./_descriptors":"../../../../node_modules/core-js/modules/_descriptors.js"}],"../../../../node_modules/core-js/modules/_object-create.js":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"../../../../node_modules/core-js/modules/_an-object.js","./_object-dps":"../../../../node_modules/core-js/modules/_object-dps.js","./_enum-bug-keys":"../../../../node_modules/core-js/modules/_enum-bug-keys.js","./_shared-key":"../../../../node_modules/core-js/modules/_shared-key.js","./_dom-create":"../../../../node_modules/core-js/modules/_dom-create.js","./_html":"../../../../node_modules/core-js/modules/_html.js"}],"../../../../node_modules/core-js/modules/_set-to-string-tag.js":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"../../../../node_modules/core-js/modules/_object-dp.js","./_has":"../../../../node_modules/core-js/modules/_has.js","./_wks":"../../../../node_modules/core-js/modules/_wks.js"}],"../../../../node_modules/core-js/modules/_iter-create.js":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"../../../../node_modules/core-js/modules/_object-create.js","./_property-desc":"../../../../node_modules/core-js/modules/_property-desc.js","./_set-to-string-tag":"../../../../node_modules/core-js/modules/_set-to-string-tag.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js","./_wks":"../../../../node_modules/core-js/modules/_wks.js"}],"../../../../node_modules/core-js/modules/_to-object.js":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"../../../../node_modules/core-js/modules/_defined.js"}],"../../../../node_modules/core-js/modules/_object-gpo.js":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"../../../../node_modules/core-js/modules/_has.js","./_to-object":"../../../../node_modules/core-js/modules/_to-object.js","./_shared-key":"../../../../node_modules/core-js/modules/_shared-key.js"}],"../../../../node_modules/core-js/modules/_iter-define.js":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"../../../../node_modules/core-js/modules/_library.js","./_export":"../../../../node_modules/core-js/modules/_export.js","./_redefine":"../../../../node_modules/core-js/modules/_redefine.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js","./_iterators":"../../../../node_modules/core-js/modules/_iterators.js","./_iter-create":"../../../../node_modules/core-js/modules/_iter-create.js","./_set-to-string-tag":"../../../../node_modules/core-js/modules/_set-to-string-tag.js","./_object-gpo":"../../../../node_modules/core-js/modules/_object-gpo.js","./_wks":"../../../../node_modules/core-js/modules/_wks.js"}],"../../../../node_modules/core-js/modules/es6.array.iterator.js":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"../../../../node_modules/core-js/modules/_add-to-unscopables.js","./_iter-step":"../../../../node_modules/core-js/modules/_iter-step.js","./_iterators":"../../../../node_modules/core-js/modules/_iterators.js","./_to-iobject":"../../../../node_modules/core-js/modules/_to-iobject.js","./_iter-define":"../../../../node_modules/core-js/modules/_iter-define.js"}],"../../../../node_modules/core-js/modules/web.dom.iterable.js":[function(require,module,exports) {

var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./es6.array.iterator":"../../../../node_modules/core-js/modules/es6.array.iterator.js","./_object-keys":"../../../../node_modules/core-js/modules/_object-keys.js","./_redefine":"../../../../node_modules/core-js/modules/_redefine.js","./_global":"../../../../node_modules/core-js/modules/_global.js","./_hide":"../../../../node_modules/core-js/modules/_hide.js","./_iterators":"../../../../node_modules/core-js/modules/_iterators.js","./_wks":"../../../../node_modules/core-js/modules/_wks.js"}],"../../../../node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js":[function(require,module,exports) {
var global = arguments[3];
/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';var n,p="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};function ba(){ba=function(){};p.Symbol||(p.Symbol=ca)}var ca=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();
function da(){ba();var a=p.Symbol.iterator;a||(a=p.Symbol.iterator=p.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(this)}});da=function(){}}function ea(a){var b=0;return fa(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function fa(a){da();a={next:a};a[p.Symbol.iterator]=function(){return this};return a}function ia(a){da();var b=a[Symbol.iterator];return b?b.call(a):ea(a)}
function ja(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}
(function(){if(!function(){var a=document.createEvent("Event");a.initEvent("foo",!0,!0);a.preventDefault();return a.defaultPrevented}()){var a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(a.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return!0},configurable:!0}))}}var b=/Trident/.test(navigator.userAgent);if(!window.CustomEvent||b&&"function"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent("CustomEvent");
c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c},window.CustomEvent.prototype=window.Event.prototype;if(!window.Event||b&&"function"!==typeof window.Event){var c=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent("Event");c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(c)for(var d in c)window.Event[d]=c[d];window.Event.prototype=c.prototype}if(!window.MouseEvent||b&&"function"!==typeof window.MouseEvent){b=window.MouseEvent;window.MouseEvent=function(a,
b){b=b||{};var c=document.createEvent("MouseEvent");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(b)for(d in b)window.MouseEvent[d]=b[d];window.MouseEvent.prototype=b.prototype}Array.from||(Array.from=function(a){return[].slice.call(a)});Object.assign||(Object.assign=function(a,b){for(var c=[].slice.call(arguments,1),d=0,e;d<c.length;d++)if(e=c[d])for(var f=
a,m=e,q=Object.getOwnPropertyNames(m),x=0;x<q.length;x++)e=q[x],f[e]=m[e];return a})})(window.WebComponents);(function(){function a(){}function b(a,b){if(!a.childNodes.length)return[];switch(a.nodeType){case Node.DOCUMENT_NODE:return ua.call(a,b);case Node.DOCUMENT_FRAGMENT_NODE:return lb.call(a,b);default:return U.call(a,b)}}var c="undefined"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function a(a,b){if(a instanceof DocumentFragment)for(var d;d=a.firstChild;)c.call(this,d,b);else c.call(this,
a,b);return a}e=!0;var b=Node.prototype.cloneNode;Node.prototype.cloneNode=function(a){a=b.call(this,a);this instanceof DocumentFragment&&(a.__proto__=DocumentFragment.prototype);return a};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},
configurable:!0},nodeName:{get:function(){return"#document-fragment"},configurable:!0}});var c=Node.prototype.insertBefore;Node.prototype.insertBefore=a;var d=Node.prototype.appendChild;Node.prototype.appendChild=function(b){b instanceof DocumentFragment?a.call(this,b,null):d.call(this,b);return b};var f=Node.prototype.removeChild,g=Node.prototype.replaceChild;Node.prototype.replaceChild=function(b,c){b instanceof DocumentFragment?(a.call(this,b,c),f.call(this,c)):g.call(this,b,c);return c};Document.prototype.createDocumentFragment=
function(){var a=this.createElement("df");a.__proto__=DocumentFragment.prototype;return a};var h=Document.prototype.importNode;Document.prototype.importNode=function(a,b){b=h.call(this,a,b||!1);a instanceof DocumentFragment&&(b.__proto__=DocumentFragment.prototype);return b}}();var f=Node.prototype.cloneNode,g=Document.prototype.createElement,h=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,m=Node.prototype.replaceChild,q=DOMParser.prototype.parseFromString,
x=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML")||{get:function(){return this.innerHTML},set:function(a){this.innerHTML=a}},M=Object.getOwnPropertyDescriptor(window.Node.prototype,"childNodes")||{get:function(){return this.childNodes}},U=Element.prototype.querySelectorAll,ua=Document.prototype.querySelectorAll,lb=DocumentFragment.prototype.querySelectorAll,mb=function(){if(!c){var a=document.createElement("template"),b=document.createElement("template");b.content.appendChild(document.createElement("div"));
a.content.appendChild(b);a=a.cloneNode(!0);return 0===a.content.childNodes.length||0===a.content.firstChild.content.childNodes.length||d}}();if(c){var S=document.implementation.createHTMLDocument("template"),C=!0,V=document.createElement("style");V.textContent="template{display:none;}";var ha=document.head;ha.insertBefore(V,ha.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var va=!document.createElement("div").hasOwnProperty("innerHTML");a.G=function(b){if(!b.content&&b.namespaceURI===
document.documentElement.namespaceURI){b.content=S.createDocumentFragment();for(var c;c=b.firstChild;)l.call(b.content,c);if(va)b.__proto__=a.prototype;else if(b.cloneNode=function(b){return a.a(this,b)},C)try{P(b),W(b)}catch(Tg){C=!1}a.C(b.content)}};var X={option:["select"],thead:["table"],col:["colgroup","table"],tr:["tbody","table"],th:["tr","tbody","table"],td:["tr","tbody","table"]},P=function(b){Object.defineProperty(b,"innerHTML",{get:function(){return nb(this)},set:function(b){var c=X[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(b)||
["",""])[1].toLowerCase()];if(c)for(var d=0;d<c.length;d++)b="<"+c[d]+">"+b+"</"+c[d]+">";S.body.innerHTML=b;for(a.C(S);this.content.firstChild;)k.call(this.content,this.content.firstChild);b=S.body;if(c)for(d=0;d<c.length;d++)b=b.lastChild;for(;b.firstChild;)l.call(this.content,b.firstChild)},configurable:!0})},W=function(a){Object.defineProperty(a,"outerHTML",{get:function(){return"<template>"+this.innerHTML+"</template>"},set:function(a){if(this.parentNode){S.body.innerHTML=a;for(a=this.ownerDocument.createDocumentFragment();S.body.firstChild;)l.call(a,
S.body.firstChild);m.call(this.parentNode,a,this)}else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");},configurable:!0})};P(a.prototype);W(a.prototype);a.C=function(c){c=b(c,"template");for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)a.G(f)};document.addEventListener("DOMContentLoaded",function(){a.C(document)});Document.prototype.createElement=function(){var b=g.apply(this,arguments);"template"===b.localName&&a.G(b);return b};DOMParser.prototype.parseFromString=
function(){var b=q.apply(this,arguments);a.C(b);return b};Object.defineProperty(HTMLElement.prototype,"innerHTML",{get:function(){return nb(this)},set:function(b){x.set.call(this,b);a.C(this)},configurable:!0,enumerable:!0});var Ve=/[&\u00A0"]/g,yc=/[&\u00A0<>]/g,zc=function(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}};V=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b};var We=V("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
Xe=V("style script xmp iframe noembed noframes plaintext noscript".split(" ")),nb=function(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):M.get.call(a),e=0,f=d.length,g;e<f&&(g=d[e]);e++){a:{var h=g;var k=a;var l=b;switch(h.nodeType){case Node.ELEMENT_NODE:for(var P=h.localName,m="<"+P,W=h.attributes,q=0;k=W[q];q++)m+=" "+k.name+'="'+k.value.replace(Ve,zc)+'"';m+=">";h=We[P]?m:m+nb(h,l)+"</"+P+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&Xe[k.localName]?h:h.replace(yc,zc);break a;
case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),Error("not implemented");}}c+=h}return c}}if(c||mb){a.a=function(a,b){var c=f.call(a,!1);this.G&&this.G(c);b&&(l.call(c.content,f.call(a.content,!0)),ob(c.content,a.content));return c};var ob=function(c,d){if(d.querySelectorAll&&(d=b(d,"template"),0!==d.length)){c=b(c,"template");for(var e=0,f=c.length,g,h;e<f;e++)h=d[e],g=c[e],a&&a.G&&a.G(h),m.call(g.parentNode,Ye.call(h,!0),g)}},Ye=Node.prototype.cloneNode=
function(b){if(!e&&d&&this instanceof DocumentFragment)if(b)var c=Ze.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else this.nodeType===Node.ELEMENT_NODE&&"template"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?c=a.a(this,b):c=f.call(this,b);b&&ob(c,this);return c},Ze=Document.prototype.importNode=function(c,d){d=d||!1;if("template"===c.localName)return a.a(c,d);var e=h.call(this,c,d);if(d){ob(e,c);c=b(e,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');
for(var f,k=0;k<c.length;k++){f=c[k];d=g.call(document,"script");d.textContent=f.textContent;for(var l=f.attributes,P=0,W;P<l.length;P++)W=l[P],d.setAttribute(W.name,W.value);m.call(f.parentNode,d,f)}}return e}}c&&(window.HTMLTemplateElement=a)})();var ka=setTimeout;function la(){}function ma(a,b){return function(){a.apply(b,arguments)}}function r(a){if(!(this instanceof r))throw new TypeError("Promises must be constructed via new");if("function"!==typeof a)throw new TypeError("not a function");this.u=0;this.ma=!1;this.h=void 0;this.I=[];na(a,this)}
function oa(a,b){for(;3===a.u;)a=a.h;0===a.u?a.I.push(b):(a.ma=!0,pa(function(){var c=1===a.u?b.Na:b.Oa;if(null===c)(1===a.u?qa:ra)(b.ga,a.h);else{try{var d=c(a.h)}catch(e){ra(b.ga,e);return}qa(b.ga,d)}}))}function qa(a,b){try{if(b===a)throw new TypeError("A promise cannot be resolved with itself.");if(b&&("object"===typeof b||"function"===typeof b)){var c=b.then;if(b instanceof r){a.u=3;a.h=b;sa(a);return}if("function"===typeof c){na(ma(c,b),a);return}}a.u=1;a.h=b;sa(a)}catch(d){ra(a,d)}}
function ra(a,b){a.u=2;a.h=b;sa(a)}function sa(a){2===a.u&&0===a.I.length&&pa(function(){a.ma||"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",a.h)});for(var b=0,c=a.I.length;b<c;b++)oa(a,a.I[b]);a.I=null}function ta(a,b,c){this.Na="function"===typeof a?a:null;this.Oa="function"===typeof b?b:null;this.ga=c}function na(a,b){var c=!1;try{a(function(a){c||(c=!0,qa(b,a))},function(a){c||(c=!0,ra(b,a))})}catch(d){c||(c=!0,ra(b,d))}}
r.prototype["catch"]=function(a){return this.then(null,a)};r.prototype.then=function(a,b){var c=new this.constructor(la);oa(this,new ta(a,b,c));return c};r.prototype["finally"]=function(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})};
function wa(a){return new r(function(b,c){function d(a,g){try{if(g&&("object"===typeof g||"function"===typeof g)){var h=g.then;if("function"===typeof h){h.call(g,function(b){d(a,b)},c);return}}e[a]=g;0===--f&&b(e)}catch(m){c(m)}}if(!a||"undefined"===typeof a.length)throw new TypeError("Promise.all accepts an array");var e=Array.prototype.slice.call(a);if(0===e.length)return b([]);for(var f=e.length,g=0;g<e.length;g++)d(g,e[g])})}
function xa(a){return a&&"object"===typeof a&&a.constructor===r?a:new r(function(b){b(a)})}function ya(a){return new r(function(b,c){c(a)})}function za(a){return new r(function(b,c){for(var d=0,e=a.length;d<e;d++)a[d].then(b,c)})}var pa="function"===typeof setImmediate&&function(a){setImmediate(a)}||function(a){ka(a,0)};/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
if(!window.Promise){window.Promise=r;r.prototype.then=r.prototype.then;r.all=wa;r.race=za;r.resolve=xa;r.reject=ya;var Aa=document.createTextNode(""),Ba=[];(new MutationObserver(function(){for(var a=Ba.length,b=0;b<a;b++)Ba[b]();Ba.splice(0,a)})).observe(Aa,{characterData:!0});pa=function(a){Ba.push(a);Aa.textContent=0<Aa.textContent.length?"":"a"}};(function(a){function b(a,b){if("function"===typeof window.CustomEvent)return new CustomEvent(a,b);var c=document.createEvent("CustomEvent");c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c}function c(a){if(M)return a.ownerDocument!==document?a.ownerDocument:null;var b=a.__importDoc;if(!b&&a.parentNode){b=a.parentNode;if("function"===typeof b.closest)b=b.closest("link[rel=import]");else for(;!h(b)&&(b=b.parentNode););a.__importDoc=b}return b}function d(a){var b=m(document,"link[rel=import]:not([import-dependency])"),
c=b.length;c?q(b,function(b){return g(b,function(){0===--c&&a()})}):a()}function e(a){function b(){"loading"!==document.readyState&&document.body&&(document.removeEventListener("readystatechange",b),a())}document.addEventListener("readystatechange",b);b()}function f(a){e(function(){return d(function(){return a&&a()})})}function g(a,b){if(a.__loaded)b&&b();else if("script"===a.localName&&!a.src||"style"===a.localName&&!a.firstChild)a.__loaded=!0,b&&b();else{var c=function(d){a.removeEventListener(d.type,
c);a.__loaded=!0;b&&b()};a.addEventListener("load",c);ha&&"style"===a.localName||a.addEventListener("error",c)}}function h(a){return a.nodeType===Node.ELEMENT_NODE&&"link"===a.localName&&"import"===a.rel}function k(){var a=this;this.a={};this.b=0;this.c=new MutationObserver(function(b){return a.Ja(b)});this.c.observe(document.head,{childList:!0,subtree:!0});this.loadImports(document)}function l(a){q(m(a,"template"),function(a){q(m(a.content,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"],script[type="module"]'),
function(a){var b=document.createElement("script");q(a.attributes,function(a){return b.setAttribute(a.name,a.value)});b.textContent=a.textContent;a.parentNode.replaceChild(b,a)});l(a.content)})}function m(a,b){return a.childNodes.length?a.querySelectorAll(b):U}function q(a,b,c){var d=a?a.length:0,e=c?-1:1;for(c=c?d-1:0;c<d&&0<=c;c+=e)b(a[c],c)}var x=document.createElement("link"),M="import"in x,U=x.querySelectorAll("*"),ua=null;!1==="currentScript"in document&&Object.defineProperty(document,"currentScript",
{get:function(){return ua||("complete"!==document.readyState?document.scripts[document.scripts.length-1]:null)},configurable:!0});var lb=/(url\()([^)]*)(\))/g,mb=/(@import[\s]+(?!url\())([^;]*)(;)/g,S=/(<link[^>]*)(rel=['|"]?stylesheet['|"]?[^>]*>)/g,C={Ea:function(a,b){a.href&&a.setAttribute("href",C.X(a.getAttribute("href"),b));a.src&&a.setAttribute("src",C.X(a.getAttribute("src"),b));if("style"===a.localName){var c=C.qa(a.textContent,b,lb);a.textContent=C.qa(c,b,mb)}},qa:function(a,b,c){return a.replace(c,
function(a,c,d,e){a=d.replace(/["']/g,"");b&&(a=C.X(a,b));return c+"'"+a+"'"+e})},X:function(a,b){if(void 0===C.aa){C.aa=!1;try{var c=new URL("b","http://a");c.pathname="c%20d";C.aa="http://a/c%20d"===c.href}catch(yc){}}if(C.aa)return(new URL(a,b)).href;c=C.xa;c||(c=document.implementation.createHTMLDocument("temp"),C.xa=c,c.ja=c.createElement("base"),c.head.appendChild(c.ja),c.ia=c.createElement("a"));c.ja.href=b;c.ia.href=a;return c.ia.href||a}},V={async:!0,load:function(a,b,c){if(a)if(a.match(/^data:/)){a=
a.split(",");var d=a[1];d=-1<a[0].indexOf(";base64")?atob(d):decodeURIComponent(d);b(d)}else{var e=new XMLHttpRequest;e.open("GET",a,V.async);e.onload=function(){var a=e.responseURL||e.getResponseHeader("Location");a&&0===a.indexOf("/")&&(a=(location.origin||location.protocol+"//"+location.host)+a);var d=e.response||e.responseText;304===e.status||0===e.status||200<=e.status&&300>e.status?b(d,a):c(d)};e.send()}else c("error: href must be specified")}},ha=/Trident/.test(navigator.userAgent)||/Edge\/\d./i.test(navigator.userAgent);
k.prototype.loadImports=function(a){var b=this;a=m(a,"link[rel=import]");q(a,function(a){return b.g(a)})};k.prototype.g=function(a){var b=this,c=a.href;if(void 0!==this.a[c]){var d=this.a[c];d&&d.__loaded&&(a.__import=d,this.f(a))}else this.b++,this.a[c]="pending",V.load(c,function(a,d){a=b.Ka(a,d||c);b.a[c]=a;b.b--;b.loadImports(a);b.l()},function(){b.a[c]=null;b.b--;b.l()})};k.prototype.Ka=function(a,b){if(!a)return document.createDocumentFragment();ha&&(a=a.replace(S,function(a,b,c){return-1===
a.indexOf("type=")?b+" type=import-disable "+c:a}));var c=document.createElement("template");c.innerHTML=a;if(c.content)a=c.content,l(a);else for(a=document.createDocumentFragment();c.firstChild;)a.appendChild(c.firstChild);if(c=a.querySelector("base"))b=C.X(c.getAttribute("href"),b),c.removeAttribute("href");c=m(a,'link[rel=import],link[rel=stylesheet][href][type=import-disable],style:not([type]),link[rel=stylesheet][href]:not([type]),script:not([type]),script[type="application/javascript"],script[type="text/javascript"],script[type="module"]');
var d=0;q(c,function(a){g(a);C.Ea(a,b);a.setAttribute("import-dependency","");if("script"===a.localName&&!a.src&&a.textContent){if("module"===a.type)throw Error("Inline module scripts are not supported in HTML Imports.");a.setAttribute("src","data:text/javascript;charset=utf-8,"+encodeURIComponent(a.textContent+("\n//# sourceURL="+b+(d?"-"+d:"")+".js\n")));a.textContent="";d++}});return a};k.prototype.l=function(){var a=this;if(!this.b){this.c.disconnect();this.flatten(document);var b=!1,c=!1,d=function(){c&&
b&&(a.loadImports(document),a.b||(a.c.observe(document.head,{childList:!0,subtree:!0}),a.da()))};this.Ma(function(){c=!0;d()});this.La(function(){b=!0;d()})}};k.prototype.flatten=function(a){var b=this;a=m(a,"link[rel=import]");q(a,function(a){var c=b.a[a.href];(a.__import=c)&&c.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&(b.a[a.href]=a,a.readyState="loading",a.__import=a,b.flatten(c),a.appendChild(c))})};k.prototype.La=function(a){function b(e){if(e<d){var f=c[e],h=document.createElement("script");f.removeAttribute("import-dependency");
q(f.attributes,function(a){return h.setAttribute(a.name,a.value)});ua=h;f.parentNode.replaceChild(h,f);g(h,function(){ua=null;b(e+1)})}else a()}var c=m(document,"script[import-dependency]"),d=c.length;b(0)};k.prototype.Ma=function(a){var b=m(document,"style[import-dependency],link[rel=stylesheet][import-dependency]"),d=b.length;if(d){var e=ha&&!!document.querySelector("link[rel=stylesheet][href][type=import-disable]");q(b,function(b){g(b,function(){b.removeAttribute("import-dependency");0===--d&&
a()});if(e&&b.parentNode!==document.head){var f=document.createElement(b.localName);f.__appliedElement=b;f.setAttribute("type","import-placeholder");b.parentNode.insertBefore(f,b.nextSibling);for(f=c(b);f&&c(f);)f=c(f);f.parentNode!==document.head&&(f=null);document.head.insertBefore(b,f);b.removeAttribute("type")}})}else a()};k.prototype.da=function(){var a=this,b=m(document,"link[rel=import]");q(b,function(b){return a.f(b)},!0)};k.prototype.f=function(a){a.__loaded||(a.__loaded=!0,a.import&&(a.import.readyState=
"complete"),a.dispatchEvent(b(a.import?"load":"error",{bubbles:!1,cancelable:!1,detail:void 0})))};k.prototype.Ja=function(a){var b=this;q(a,function(a){return q(a.addedNodes,function(a){a&&a.nodeType===Node.ELEMENT_NODE&&(h(a)?b.g(a):b.loadImports(a))})})};var va=null;if(M)x=m(document,"link[rel=import]"),q(x,function(a){a.import&&"loading"===a.import.readyState||(a.__loaded=!0)}),x=function(a){a=a.target;h(a)&&(a.__loaded=!0)},document.addEventListener("load",x,!0),document.addEventListener("error",
x,!0);else{var X=Object.getOwnPropertyDescriptor(Node.prototype,"baseURI");Object.defineProperty((!X||X.configurable?Node:Element).prototype,"baseURI",{get:function(){var a=h(this)?this:c(this);return a?a.href:X&&X.get?X.get.call(this):(document.querySelector("base")||window.location).href},configurable:!0,enumerable:!0});Object.defineProperty(HTMLLinkElement.prototype,"import",{get:function(){return this.__import||null},configurable:!0,enumerable:!0});e(function(){va=new k})}f(function(){return document.dispatchEvent(b("HTMLImportsLoaded",
{cancelable:!0,bubbles:!0,detail:void 0}))});a.useNative=M;a.whenReady=f;a.importForElement=c;a.loadImports=function(a){va&&va.loadImports(a)}})(window.HTMLImports=window.HTMLImports||{});/*

 Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.WebComponents=window.WebComponents||{flags:{}};var Ca=document.querySelector('script[src*="webcomponents-lite.js"]'),Da=/wc-(.+)/,t={};if(!t.noOpts){location.search.slice(1).split("&").forEach(function(a){a=a.split("=");var b;a[0]&&(b=a[0].match(Da))&&(t[b[1]]=a[1]||!0)});if(Ca)for(var Ea=0,Fa=void 0;Fa=Ca.attributes[Ea];Ea++)"src"!==Fa.name&&(t[Fa.name]=Fa.value||!0);if(t.log&&t.log.split){var Ga=t.log.split(",");t.log={};Ga.forEach(function(a){t.log[a]=!0})}else t.log={}}
window.WebComponents.flags=t;var Ha=t.shadydom;Ha&&(window.ShadyDOM=window.ShadyDOM||{},window.ShadyDOM.force=Ha);var Ia=t.register||t.ce;Ia&&window.customElements&&(window.customElements.forcePolyfill=Ia);/*

Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Ja(){this.pa=this.root=null;this.T=!1;this.D=this.P=this.ca=this.assignedSlot=this.assignedNodes=this.H=null;this.childNodes=this.nextSibling=this.previousSibling=this.lastChild=this.firstChild=this.parentNode=this.K=void 0;this.ka=this.la=!1;this.O={}}Ja.prototype.toJSON=function(){return{}};function u(a){a.__shady||(a.__shady=new Ja);return a.__shady}function v(a){return a&&a.__shady};var w=window.ShadyDOM||{};w.Ga=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var Ka=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild");w.m=!!(Ka&&Ka.configurable&&Ka.get);w.ea=w.force||!w.Ga;w.J=w.noPatch||!1;w.oa=w.preferPerformance;function y(a){return(a=v(a))&&void 0!==a.firstChild}function z(a){return"ShadyRoot"===a.za}function La(a){return(a=(a=v(a))&&a.root)&&Ma(a)}
var Na=Element.prototype,Oa=Na.matches||Na.matchesSelector||Na.mozMatchesSelector||Na.msMatchesSelector||Na.oMatchesSelector||Na.webkitMatchesSelector,Pa=document.createTextNode(""),Qa=0,Ra=[];(new MutationObserver(function(){for(;Ra.length;)try{Ra.shift()()}catch(a){throw Pa.textContent=Qa++,a;}})).observe(Pa,{characterData:!0});function Sa(a){Ra.push(a);Pa.textContent=Qa++}var Ta=!!document.contains;function Ua(a,b){for(;b;){if(b==a)return!0;b=b.__shady_parentNode}return!1}
function Va(a){for(var b=a.length-1;0<=b;b--){var c=a[b],d=c.getAttribute("id")||c.getAttribute("name");d&&"length"!==d&&isNaN(d)&&(a[d]=c)}a.item=function(b){return a[b]};a.namedItem=function(b){if("length"!==b&&isNaN(b)&&a[b])return a[b];for(var c=ia(a),d=c.next();!d.done;d=c.next())if(d=d.value,(d.getAttribute("id")||d.getAttribute("name"))==b)return d;return null};return a}
function A(a,b,c,d){c=void 0===c?"":c;for(var e in b){var f=b[e];if(!(d&&0<=d.indexOf(e))){f.configurable=!0;var g=c+e;if(f.value)a[g]=f.value;else try{Object.defineProperty(a,g,f)}catch(h){}}}}function B(a){var b={};Object.getOwnPropertyNames(a).forEach(function(c){b[c]=Object.getOwnPropertyDescriptor(a,c)});return b};var Wa=[],Xa;function Ya(a){Xa||(Xa=!0,Sa(Za));Wa.push(a)}function Za(){Xa=!1;for(var a=!!Wa.length;Wa.length;)Wa.shift()();return a}Za.list=Wa;function $a(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.S=new Set}function ab(a){a.a||(a.a=!0,Sa(function(){a.flush()}))}$a.prototype.flush=function(){if(this.a){this.a=!1;var a=this.takeRecords();a.length&&this.S.forEach(function(b){b(a)})}};$a.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return[]};
function bb(a,b){var c=u(a);c.H||(c.H=new $a);c.H.S.add(b);var d=c.H;return{ya:b,F:d,Aa:a,takeRecords:function(){return d.takeRecords()}}}function cb(a){var b=a&&a.F;b&&(b.S.delete(a.ya),b.S.size||(u(a.Aa).H=null))}
function db(a,b){var c=b.getRootNode();return a.map(function(a){var b=c===a.target.getRootNode();if(b&&a.addedNodes){if(b=Array.from(a.addedNodes).filter(function(a){return c===a.getRootNode()}),b.length)return a=Object.create(a),Object.defineProperty(a,"addedNodes",{value:b,configurable:!0}),a}else if(b)return a}).filter(function(a){return a})};var eb=/[&\u00A0"]/g,fb=/[&\u00A0<>]/g;function gb(a){switch(a){case "&":return"&amp;";case "<":return"&lt;";case ">":return"&gt;";case '"':return"&quot;";case "\u00a0":return"&nbsp;"}}function hb(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var ib=hb("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),jb=hb("style script xmp iframe noembed noframes plaintext noscript".split(" "));
function kb(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):a.childNodes,e=0,f=d.length,g=void 0;e<f&&(g=d[e]);e++){a:{var h=g;var k=a,l=b;switch(h.nodeType){case Node.ELEMENT_NODE:k=h.localName;for(var m="<"+k,q=h.attributes,x=0,M;M=q[x];x++)m+=" "+M.name+'="'+M.value.replace(eb,gb)+'"';m+=">";h=ib[k]?m:m+kb(h,l)+"</"+k+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&jb[k.localName]?h:h.replace(fb,gb);break a;case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),
Error("not implemented");}}c+=h}return c};var pb=w.m,qb={querySelector:function(a){return this.__shady_native_querySelector(a)},querySelectorAll:function(a){return this.__shady_native_querySelectorAll(a)}},rb={};function sb(a){rb[a]=function(b){return b["__shady_native_"+a]}}function tb(a,b){A(a,b,"__shady_native_");for(var c in b)sb(c)}function D(a,b){b=void 0===b?[]:b;for(var c=0;c<b.length;c++){var d=b[c],e=Object.getOwnPropertyDescriptor(a,d);e&&(Object.defineProperty(a,"__shady_native_"+d,e),e.value?qb[d]||(qb[d]=e.value):sb(d))}}
var E=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),F=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1),ub=document.implementation.createHTMLDocument("inert");function vb(a){for(var b;b=a.__shady_native_firstChild;)a.__shady_native_removeChild(b)}var wb=["firstElementChild","lastElementChild","children","childElementCount"],xb=["querySelector","querySelectorAll"];
function yb(){var a=["dispatchEvent","addEventListener","removeEventListener"];window.EventTarget?D(window.EventTarget.prototype,a):(D(Node.prototype,a),D(Window.prototype,a));pb?D(Node.prototype,"parentNode firstChild lastChild previousSibling nextSibling childNodes parentElement textContent".split(" ")):tb(Node.prototype,{parentNode:{get:function(){E.currentNode=this;return E.parentNode()}},firstChild:{get:function(){E.currentNode=this;return E.firstChild()}},lastChild:{get:function(){E.currentNode=
this;return E.lastChild()}},previousSibling:{get:function(){E.currentNode=this;return E.previousSibling()}},nextSibling:{get:function(){E.currentNode=this;return E.nextSibling()}},childNodes:{get:function(){var a=[];E.currentNode=this;for(var c=E.firstChild();c;)a.push(c),c=E.nextSibling();return a}},parentElement:{get:function(){F.currentNode=this;return F.parentNode()}},textContent:{get:function(){switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:for(var a=document.createTreeWalker(this,
NodeFilter.SHOW_TEXT,null,!1),c="",d;d=a.nextNode();)c+=d.nodeValue;return c;default:return this.nodeValue}},set:function(a){if("undefined"===typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:vb(this);(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_native_insertBefore(document.createTextNode(a),void 0);break;default:this.nodeValue=a}}}});D(Node.prototype,"appendChild insertBefore removeChild replaceChild cloneNode contains".split(" "));
a={firstElementChild:{get:function(){F.currentNode=this;return F.firstChild()}},lastElementChild:{get:function(){F.currentNode=this;return F.lastChild()}},children:{get:function(){var a=[];F.currentNode=this;for(var c=F.firstChild();c;)a.push(c),c=F.nextSibling();return Va(a)}},childElementCount:{get:function(){return this.children?this.children.length:0}}};pb?(D(Element.prototype,wb),D(Element.prototype,["previousElementSibling","nextElementSibling","innerHTML"]),Object.getOwnPropertyDescriptor(HTMLElement.prototype,
"children")&&D(HTMLElement.prototype,["children"]),Object.getOwnPropertyDescriptor(HTMLElement.prototype,"innerHTML")&&D(HTMLElement.prototype,["innerHTML"])):(tb(Element.prototype,a),tb(Element.prototype,{previousElementSibling:{get:function(){F.currentNode=this;return F.previousSibling()}},nextElementSibling:{get:function(){F.currentNode=this;return F.nextSibling()}},innerHTML:{get:function(){return kb(this,function(a){return a.__shady_native_childNodes})},set:function(a){var b="template"===this.localName?
this.content:this;vb(b);var d=this.localName||"div";d=this.namespaceURI&&this.namespaceURI!==ub.namespaceURI?ub.createElementNS(this.namespaceURI,d):ub.createElement(d);d.innerHTML=a;for(a="template"===this.localName?d.content:d;d=a.__shady_native_firstChild;)b.__shady_native_insertBefore(d,void 0)}}}));D(Element.prototype,"setAttribute getAttribute hasAttribute removeAttribute focus blur".split(" "));D(Element.prototype,xb);D(HTMLElement.prototype,["focus","blur","contains"]);pb&&D(HTMLElement.prototype,
["parentElement","children","innerHTML"]);window.HTMLTemplateElement&&D(window.HTMLTemplateElement.prototype,["innerHTML"]);pb?D(DocumentFragment.prototype,wb):tb(DocumentFragment.prototype,a);D(DocumentFragment.prototype,xb);pb?(D(Document.prototype,wb),D(Document.prototype,["activeElement"])):tb(Document.prototype,a);D(Document.prototype,["importNode","getElementById"]);D(Document.prototype,xb)};var zb=B({get childNodes(){return this.__shady_childNodes},get firstChild(){return this.__shady_firstChild},get lastChild(){return this.__shady_lastChild},get textContent(){return this.__shady_textContent},set textContent(a){this.__shady_textContent=a},get childElementCount(){return this.__shady_childElementCount},get children(){return this.__shady_children},get firstElementChild(){return this.__shady_firstElementChild},get lastElementChild(){return this.__shady_lastElementChild},get innerHTML(){return this.__shady_innerHTML},
set innerHTML(a){return this.__shady_innerHTML=a},get shadowRoot(){return this.__shady_shadowRoot}}),Ab=B({get parentElement(){return this.__shady_parentElement},get parentNode(){return this.__shady_parentNode},get nextSibling(){return this.__shady_nextSibling},get previousSibling(){return this.__shady_previousSibling},get nextElementSibling(){return this.__shady_nextElementSibling},get previousElementSibling(){return this.__shady_previousElementSibling},get className(){return this.__shady_className},
set className(a){return this.__shady_className=a}}),Bb;for(Bb in zb)zb[Bb].enumerable=!1;for(var Cb in Ab)Ab[Cb].enumerable=!1;var Db=w.m||w.J,Eb=Db?function(){}:function(a){var b=u(a);b.la||(b.la=!0,A(a,Ab))},Fb=Db?function(){}:function(a){var b=u(a);b.ka||(b.ka=!0,A(a,zb))};var Gb="__eventWrappers"+Date.now(),Hb=function(){var a=Object.getOwnPropertyDescriptor(Event.prototype,"composed");return a?function(b){return a.get.call(b)}:null}(),Ib={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,
pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,dragstart:!0,drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0},Jb={DOMAttrModified:!0,DOMAttributeNameChanged:!0,DOMCharacterDataModified:!0,DOMElementNameChanged:!0,DOMNodeInserted:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemoved:!0,DOMNodeRemovedFromDocument:!0,DOMSubtreeModified:!0};
function Kb(a){return a instanceof Node?a.__shady_getRootNode():a}function Lb(a,b){var c=[],d=a;for(a=Kb(a);d;)c.push(d),d.__shady_assignedSlot?d=d.__shady_assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d=d.host:d=d.__shady_parentNode;c[c.length-1]===document&&c.push(window);return c}function Mb(a){a.__composedPath||(a.__composedPath=Lb(a.target,!0));return a.__composedPath}
function Nb(a,b){if(!z)return a;a=Lb(a,!0);for(var c=0,d,e=void 0,f,g=void 0;c<b.length;c++)if(d=b[c],f=Kb(d),f!==e&&(g=a.indexOf(f),e=f),!z(f)||-1<g)return d}function Ob(a){function b(b,d){b=new a(b,d);b.__composed=d&&!!d.composed;return b}b.__proto__=a;b.prototype=a.prototype;return b}var Pb={focus:!0,blur:!0};function Qb(a){return a.__target!==a.target||a.__relatedTarget!==a.relatedTarget}
function Rb(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!Qb(a)||a.target!==a.relatedTarget)&&(e.call(b,a),!a.__immediatePropagationStopped);d++);}
function Sb(a){var b=a.composedPath();Object.defineProperty(a,"currentTarget",{get:function(){return d},configurable:!0});for(var c=b.length-1;0<=c;c--){var d=b[c];Rb(a,d,"capture");if(a.Z)return}Object.defineProperty(a,"eventPhase",{get:function(){return Event.AT_TARGET}});var e;for(c=0;c<b.length;c++){d=b[c];var f=v(d);f=f&&f.root;if(0===c||f&&f===e)if(Rb(a,d,"bubble"),d!==window&&(e=d.__shady_getRootNode()),a.Z)break}}
function Tb(a,b,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g],k=h.type,l=h.capture,m=h.once,q=h.passive;if(b===h.node&&c===k&&d===l&&e===m&&f===q)return g}return-1}
function Ub(a,b,c){if(b){var d=typeof b;if("function"===d||"object"===d)if("object"!==d||b.handleEvent&&"function"===typeof b.handleEvent){if(Jb[a])return this.__shady_native_addEventListener(a,b,c);if(c&&"object"===typeof c){var e=!!c.capture;var f=!!c.once;var g=!!c.passive}else e=!!c,g=f=!1;var h=c&&c.$||this,k=b[Gb];if(k){if(-1<Tb(k,h,a,e,f,g))return}else b[Gb]=[];k=function(e){f&&this.__shady_removeEventListener(a,b,c);e.__target||Vb(e);if(h!==this){var g=Object.getOwnPropertyDescriptor(e,"currentTarget");
Object.defineProperty(e,"currentTarget",{get:function(){return h},configurable:!0})}e.__previousCurrentTarget=e.currentTarget;if(!z(h)||-1!=e.composedPath().indexOf(h))if(e.composed||-1<e.composedPath().indexOf(h))if(Qb(e)&&e.target===e.relatedTarget)e.eventPhase===Event.BUBBLING_PHASE&&e.stopImmediatePropagation();else if(e.eventPhase===Event.CAPTURING_PHASE||e.bubbles||e.target===h||h instanceof Window){var k="function"===d?b.call(h,e):b.handleEvent&&b.handleEvent(e);h!==this&&(g?(Object.defineProperty(e,
"currentTarget",g),g=null):delete e.currentTarget);return k}};b[Gb].push({node:h,type:a,capture:e,once:f,passive:g,Ya:k});Pb[a]?(this.__handlers=this.__handlers||{},this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]},this.__handlers[a][e?"capture":"bubble"].push(k)):this.__shady_native_addEventListener(a,k,c)}}}
function Wb(a,b,c){if(b){if(Jb[a])return this.__shady_native_removeEventListener(a,b,c);if(c&&"object"===typeof c){var d=!!c.capture;var e=!!c.once;var f=!!c.passive}else d=!!c,f=e=!1;var g=c&&c.$||this,h=void 0;var k=null;try{k=b[Gb]}catch(l){}k&&(e=Tb(k,g,a,d,e,f),-1<e&&(h=k.splice(e,1)[0].Ya,k.length||(b[Gb]=void 0)));this.__shady_native_removeEventListener(a,h||b,c);h&&Pb[a]&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][d?"capture":"bubble"],h=a.indexOf(h),-1<h&&a.splice(h,1))}}
function Xb(){for(var a in Pb)window.__shady_native_addEventListener(a,function(a){a.__target||(Vb(a),Sb(a))},!0)}
var Yb=B({get composed(){void 0===this.__composed&&(Hb?this.__composed="focusin"===this.type||"focusout"===this.type||Hb(this):!1!==this.isTrusted&&(this.__composed=Ib[this.type]));return this.__composed||!1},composedPath:function(){this.__composedPath||(this.__composedPath=Lb(this.__target,this.composed));return this.__composedPath},get target(){return Nb(this.currentTarget||this.__previousCurrentTarget,this.composedPath())},get relatedTarget(){if(!this.__relatedTarget)return null;this.__relatedTargetComposedPath||
(this.__relatedTargetComposedPath=Lb(this.__relatedTarget,!0));return Nb(this.currentTarget||this.__previousCurrentTarget,this.__relatedTargetComposedPath)},stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.Z=!0},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);this.Z=this.__immediatePropagationStopped=!0}});
function Vb(a){a.__target=a.target;a.__relatedTarget=a.relatedTarget;if(w.m){var b=Object.getPrototypeOf(a);if(!Object.hasOwnProperty(b,"__shady_patchedProto")){var c=Object.create(b);c.__shady_sourceProto=b;A(c,Yb);b.__shady_patchedProto=c}a.__proto__=b.__shady_patchedProto}else A(a,Yb)}var Zb=Ob(Event),$b=Ob(CustomEvent),ac=Ob(MouseEvent);
function bc(){if(!Hb&&Object.getOwnPropertyDescriptor(Event.prototype,"isTrusted")){var a=function(){var a=new MouseEvent("click",{bubbles:!0,cancelable:!0,composed:!0});this.__shady_dispatchEvent(a)};Element.prototype.click?Element.prototype.click=a:HTMLElement.prototype.click&&(HTMLElement.prototype.click=a)}}var cc=Object.getOwnPropertyNames(Document.prototype).filter(function(a){return"on"===a.substring(0,2)});function dc(a,b){return{index:a,L:[],R:b}}
function ec(a,b,c,d){var e=0,f=0,g=0,h=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(g=0;g<k;g++)if(a[g]!==c[g])break a;g=k}if(b==a.length&&d==c.length){h=a.length;for(var l=c.length,m=0;m<k-g&&fc(a[--h],c[--l]);)m++;h=m}e+=g;f+=g;b-=h;d-=h;if(0==b-e&&0==d-f)return[];if(e==b){for(b=dc(e,0);f<d;)b.L.push(c[f++]);return[b]}if(f==d)return[dc(e,b-e)];k=e;g=f;d=d-g+1;h=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(h),b[l][0]=l;for(l=0;l<h;l++)b[0][l]=l;for(l=1;l<d;l++)for(m=1;m<h;m++)if(a[k+m-1]===c[g+l-1])b[l][m]=
b[l-1][m-1];else{var q=b[l-1][m]+1,x=b[l][m-1]+1;b[l][m]=q<x?q:x}k=b.length-1;g=b[0].length-1;d=b[k][g];for(a=[];0<k||0<g;)0==k?(a.push(2),g--):0==g?(a.push(3),k--):(h=b[k-1][g-1],l=b[k-1][g],m=b[k][g-1],q=l<m?l<h?l:h:m<h?m:h,q==h?(h==d?a.push(0):(a.push(1),d=h),k--,g--):q==l?(a.push(3),k--,d=l):(a.push(2),g--,d=m));a.reverse();b=void 0;k=[];for(g=0;g<a.length;g++)switch(a[g]){case 0:b&&(k.push(b),b=void 0);e++;f++;break;case 1:b||(b=dc(e,0));b.R++;e++;b.L.push(c[f]);f++;break;case 2:b||(b=dc(e,0));
b.R++;e++;break;case 3:b||(b=dc(e,0)),b.L.push(c[f]),f++}b&&k.push(b);return k}function fc(a,b){return a===b};function gc(a,b,c){Eb(a);c=c||null;var d=u(a),e=u(b),f=c?u(c):null;d.previousSibling=c?f.previousSibling:b.__shady_lastChild;if(f=v(d.previousSibling))f.nextSibling=a;if(f=v(d.nextSibling=c))f.previousSibling=a;d.parentNode=b;c?c===e.firstChild&&(e.firstChild=a):(e.lastChild=a,e.firstChild||(e.firstChild=a));e.childNodes=null}
function hc(a,b,c){Fb(b);var d=u(b);void 0!==d.firstChild&&(d.childNodes=null);if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){d=a.__shady_childNodes;for(var e=0;e<d.length;e++)gc(d[e],b,c);a=u(a);b=void 0!==a.firstChild?null:void 0;a.firstChild=a.lastChild=b;a.childNodes=b}else gc(a,b,c)}
function ic(a,b){var c=u(a);b=u(b);a===b.firstChild&&(b.firstChild=c.nextSibling);a===b.lastChild&&(b.lastChild=c.previousSibling);a=c.previousSibling;var d=c.nextSibling;a&&(u(a).nextSibling=d);d&&(u(d).previousSibling=a);c.parentNode=c.previousSibling=c.nextSibling=void 0;void 0!==b.childNodes&&(b.childNodes=null)}
function jc(a){var b=u(a);if(void 0===b.firstChild){b.childNodes=null;var c=b.firstChild=a.__shady_native_firstChild||null;b.lastChild=a.__shady_native_lastChild||null;Fb(a);b=c;for(c=void 0;b;b=b.__shady_native_nextSibling){var d=u(b);d.parentNode=a;d.nextSibling=b.__shady_native_nextSibling||null;d.previousSibling=c||null;c=b;Eb(b)}}};var kc=null;function G(){kc||(kc=window.ShadyCSS&&window.ShadyCSS.ScopingShim);return kc||null}function lc(a,b){var c=G();c&&c.unscopeNode(a,b)}function mc(a,b){var c=G();if(!c)return!0;if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){c=!0;a=a.__shady_childNodes;for(var d=0;c&&d<a.length;d++)c=c&&mc(a[d],b);return c}return a.nodeType!==Node.ELEMENT_NODE?!0:c.currentScopeForNode(a)===b}function nc(a){if(a.nodeType!==Node.ELEMENT_NODE)return"";var b=G();return b?b.currentScopeForNode(a):""}
function oc(a,b){if(a){a.nodeType===Node.ELEMENT_NODE&&b(a);a=a.__shady_childNodes;for(var c=0,d;c<a.length;c++)d=a[c],d.nodeType===Node.ELEMENT_NODE&&oc(d,b)}};var pc=window.document,qc=w.oa,rc=Object.getOwnPropertyDescriptor(Node.prototype,"isConnected"),sc=rc&&rc.get;function tc(a){for(var b;b=a.__shady_firstChild;)a.__shady_removeChild(b)}function uc(a){var b=v(a);if(b&&void 0!==b.K){b=a.__shady_childNodes;for(var c=0,d=b.length,e=void 0;c<d&&(e=b[c]);c++)uc(e)}if(a=v(a))a.K=void 0}function vc(a){var b=a;a&&"slot"===a.localName&&(b=(b=(b=v(a))&&b.D)&&b.length?b[0]:vc(a.__shady_nextSibling));return b}
function wc(a,b,c){if(a=(a=v(a))&&a.H)b&&a.addedNodes.push(b),c&&a.removedNodes.push(c),ab(a)}
var Cc=B({get parentNode(){var a=v(this);a=a&&a.parentNode;return void 0!==a?a:this.__shady_native_parentNode},get firstChild(){var a=v(this);a=a&&a.firstChild;return void 0!==a?a:this.__shady_native_firstChild},get lastChild(){var a=v(this);a=a&&a.lastChild;return void 0!==a?a:this.__shady_native_lastChild},get nextSibling(){var a=v(this);a=a&&a.nextSibling;return void 0!==a?a:this.__shady_native_nextSibling},get previousSibling(){var a=v(this);a=a&&a.previousSibling;return void 0!==a?a:this.__shady_native_previousSibling},
get childNodes(){if(y(this)){var a=v(this);if(!a.childNodes){a.childNodes=[];for(var b=this.__shady_firstChild;b;b=b.__shady_nextSibling)a.childNodes.push(b)}var c=a.childNodes}else c=this.__shady_native_childNodes;c.item=function(a){return c[a]};return c},get parentElement(){var a=v(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:this.__shady_native_parentElement},get isConnected(){if(sc&&sc.call(this))return!0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return!1;
var a=this.ownerDocument;if(Ta){if(a.__shady_native_contains(this))return!0}else if(a.documentElement&&a.documentElement.__shady_native_contains(this))return!0;for(a=this;a&&!(a instanceof Document);)a=a.__shady_parentNode||(z(a)?a.host:void 0);return!!(a&&a instanceof Document)},get textContent(){if(y(this)){for(var a=[],b=0,c=this.__shady_childNodes,d;d=c[b];b++)d.nodeType!==Node.COMMENT_NODE&&a.push(d.__shady_textContent);return a.join("")}return this.__shady_native_textContent},set textContent(a){if("undefined"===
typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!y(this)&&w.m){var b=this.__shady_firstChild;(b!=this.__shady_lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&tc(this);this.__shady_native_textContent=a}else tc(this),(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_insertBefore(document.createTextNode(a));break;default:this.nodeValue=a}},insertBefore:function(a,b){if(this.ownerDocument!==pc&&a.ownerDocument!==pc)return this.__shady_native_insertBefore(a,
b),a;if(a===this)throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");if(b){var c=v(b);c=c&&c.parentNode;if(void 0!==c&&c!==this||void 0===c&&b.__shady_native_parentNode!==this)throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");}if(b===a)return a;var d=[],e=(c=xc(this))?c.host.localName:nc(this),f=a.__shady_parentNode;if(f){var g=nc(a);f.__shady_removeChild(a,!!c||
!xc(a))}f=!0;var h=(!qc||void 0===a.__noInsertionPoint)&&!mc(a,e),k=c&&!a.__noInsertionPoint&&(!qc||a.nodeType===Node.DOCUMENT_FRAGMENT_NODE);if(k||h)h&&(g=g||nc(a)),oc(a,function(a){k&&"slot"===a.localName&&d.push(a);if(h){var b=g;G()&&(b&&lc(a,b),(b=G())&&b.scopeNode(a,e))}});if("slot"===this.localName||d.length)d.length&&(c.c=c.c||[],c.a=c.a||[],c.b=c.b||{},c.c.push.apply(c.c,d instanceof Array?d:ja(ia(d)))),c&&Ac(c);y(this)&&(hc(a,this,b),c=v(this),La(this)?(Ac(c.root),f=!1):c.root&&(f=!1));f?
(c=z(this)?this.host:this,b?(b=vc(b),c.__shady_native_insertBefore(a,b)):c.__shady_native_appendChild(a)):a.ownerDocument!==this.ownerDocument&&this.ownerDocument.adoptNode(a);wc(this,a);return a},appendChild:function(a){return this.__shady_insertBefore(a)},removeChild:function(a,b){b=void 0===b?!1:b;if(this.ownerDocument!==pc)return this.__shady_native_removeChild(a);if(a.__shady_parentNode!==this)throw Error("The node to be removed is not a child of this node: "+a);var c=xc(a),d=c&&Bc(c,a),e=v(this);
if(y(this)&&(ic(a,this),La(this))){Ac(e.root);var f=!0}if(G()&&!b&&c){var g=nc(a);oc(a,function(a){lc(a,g)})}uc(a);c&&((b=this&&"slot"===this.localName)&&(f=!0),(d||b)&&Ac(c));f||(f=z(this)?this.host:this,(!e.root&&"slot"!==a.localName||f===a.__shady_native_parentNode)&&f.__shady_native_removeChild(a));wc(this,null,a);return a},replaceChild:function(a,b){this.__shady_insertBefore(a,b);this.__shady_removeChild(b);return a},cloneNode:function(a){if("template"==this.localName)return this.__shady_native_cloneNode(a);
var b=this.__shady_native_cloneNode(!1);if(a&&b.nodeType!==Node.ATTRIBUTE_NODE){a=this.__shady_childNodes;for(var c=0,d;c<a.length;c++)d=a[c].__shady_cloneNode(!0),b.__shady_appendChild(d)}return b},getRootNode:function(a){if(this&&this.nodeType){var b=u(this),c=b.K;void 0===c&&(z(this)?(c=this,b.K=c):(c=(c=this.__shady_parentNode)?c.__shady_getRootNode(a):this,document.documentElement.__shady_native_contains(this)&&(b.K=c)));return c}},contains:function(a){return Ua(this,a)}});function Dc(a,b,c){var d=[];Ec(a.__shady_childNodes,b,c,d);return d}function Ec(a,b,c,d){for(var e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++){var h;if(h=g.nodeType===Node.ELEMENT_NODE){h=g;var k=b,l=c,m=d,q=k(h);q&&m.push(h);l&&l(q)?h=q:(Ec(h.__shady_childNodes,k,l,m),h=void 0)}if(h)break}}
var Fc=B({get firstElementChild(){var a=v(this);if(a&&void 0!==a.firstChild){for(a=this.__shady_firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_firstElementChild},get lastElementChild(){var a=v(this);if(a&&void 0!==a.lastChild){for(a=this.__shady_lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_lastElementChild},get children(){return y(this)?Va(Array.prototype.filter.call(this.__shady_childNodes,
function(a){return a.nodeType===Node.ELEMENT_NODE})):this.__shady_native_children},get childElementCount(){var a=this.__shady_children;return a?a.length:0}}),Gc=B({querySelector:function(a){return Dc(this,function(b){return Oa.call(b,a)},function(a){return!!a})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(this.__shady_native_querySelectorAll(a));var c=this.__shady_getRootNode();return b.filter(function(a){return a.__shady_getRootNode()==c})}return Dc(this,function(b){return Oa.call(b,
a)})}}),Hc=w.oa?Object.assign({},Fc):Fc;Object.assign(Fc,Gc);var Ic=B({getElementById:function(a){return""===a?null:Dc(this,function(b){return b.id==a},function(a){return!!a})[0]||null}});var Jc=B({get activeElement(){var a=w.m?document.__shady_native_activeElement:document.activeElement;if(!a||!a.nodeType)return null;var b=!!z(this);if(!(this===document||b&&this.host!==a&&this.host.__shady_native_contains(a)))return null;for(b=xc(a);b&&b!==this;)a=b.host,b=xc(a);return this===document?b?null:a:b===this?a:null}});var Kc=document.implementation.createHTMLDocument("inert"),Lc=B({get innerHTML(){return y(this)?kb("template"===this.localName?this.content:this,function(a){return a.__shady_childNodes}):this.__shady_native_innerHTML},set innerHTML(a){if("template"===this.localName)this.__shady_native_innerHTML=a;else{tc(this);var b=this.localName||"div";b=this.namespaceURI&&this.namespaceURI!==Kc.namespaceURI?Kc.createElementNS(this.namespaceURI,b):Kc.createElement(b);for(w.m?b.__shady_native_innerHTML=a:b.innerHTML=
a;a=b.__shady_firstChild;)this.__shady_insertBefore(a)}}});var Mc=B({addEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.$=this;this.host.__shady_addEventListener(a,b,c)},removeEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.$=this;this.host.__shady_removeEventListener(a,b,c)}});function Nc(a,b){A(a,Mc,b);A(a,Jc,b);A(a,Lc,b);A(a,Fc,b);w.J&&!b?(A(a,Cc,b),A(a,Ic,b)):w.m||(A(a,Ab),A(a,zb))};var Oc={},Pc=w.deferConnectionCallbacks&&"loading"===document.readyState,Qc;function Rc(a){var b=[];do b.unshift(a);while(a=a.__shady_parentNode);return b}
function Sc(a,b,c){if(a!==Oc)throw new TypeError("Illegal constructor");this.za="ShadyRoot";this.host=b;this.mode=c&&c.mode;jc(b);a=u(b);a.root=this;a.pa="closed"!==this.mode?this:null;a=u(this);a.firstChild=a.lastChild=a.parentNode=a.nextSibling=a.previousSibling=null;a.childNodes=[];this.ba=this.B=!1;this.c=this.b=this.a=null;if(w.preferPerformance)for(;a=b.__shady_native_firstChild;)b.__shady_native_removeChild(a);else Ac(this)}function Ac(a){a.B||(a.B=!0,Ya(function(){return Tc(a)}))}
function Tc(a){var b;if(b=a.B){for(var c;a;)a:{a.B&&(c=a),b=a;a=b.host.__shady_getRootNode();if(z(a)&&(b=v(b.host))&&0<b.N)break a;a=void 0}b=c}(c=b)&&c._renderSelf()}
Sc.prototype._renderSelf=function(){var a=Pc;Pc=!0;this.B=!1;if(this.a){Uc(this);for(var b=0,c;b<this.a.length;b++){c=this.a[b];var d=v(c),e=d.assignedNodes;d.assignedNodes=[];d.D=[];if(d.ca=e)for(d=0;d<e.length;d++){var f=v(e[d]);f.P=f.assignedSlot;f.assignedSlot===c&&(f.assignedSlot=null)}}for(b=this.host.__shady_firstChild;b;b=b.__shady_nextSibling)Vc(this,b);for(b=0;b<this.a.length;b++){c=this.a[b];e=v(c);if(!e.assignedNodes.length)for(d=c.__shady_firstChild;d;d=d.__shady_nextSibling)Vc(this,
d,c);(d=(d=v(c.__shady_parentNode))&&d.root)&&(Ma(d)||d.B)&&d._renderSelf();Wc(this,e.D,e.assignedNodes);if(d=e.ca){for(f=0;f<d.length;f++)v(d[f]).P=null;e.ca=null;d.length>e.assignedNodes.length&&(e.T=!0)}e.T&&(e.T=!1,Xc(this,c))}c=this.a;b=[];for(e=0;e<c.length;e++)d=c[e].__shady_parentNode,(f=v(d))&&f.root||!(0>b.indexOf(d))||b.push(d);for(c=0;c<b.length;c++){f=b[c];e=f===this?this.host:f;d=[];f=f.__shady_childNodes;for(var g=0;g<f.length;g++){var h=f[g];if("slot"==h.localName){h=v(h).D;for(var k=
0;k<h.length;k++)d.push(h[k])}else d.push(h)}f=Array.prototype.slice.call(e.__shady_native_childNodes);g=ec(d,d.length,f,f.length);k=h=0;for(var l=void 0;h<g.length&&(l=g[h]);h++){for(var m=0,q=void 0;m<l.L.length&&(q=l.L[m]);m++)q.__shady_native_parentNode===e&&e.__shady_native_removeChild(q),f.splice(l.index+k,1);k-=l.R}k=0;for(l=void 0;k<g.length&&(l=g[k]);k++)for(h=f[l.index],m=l.index;m<l.index+l.R;m++)q=d[m],e.__shady_native_insertBefore(q,h),f.splice(m,0,q)}}if(!w.preferPerformance&&!this.ba)for(b=
this.host.__shady_childNodes,c=0,e=b.length;c<e;c++)d=b[c],f=v(d),d.__shady_native_parentNode!==this.host||"slot"!==d.localName&&f.assignedSlot||this.host.__shady_native_removeChild(d);this.ba=!0;Pc=a;Qc&&Qc()};function Vc(a,b,c){var d=u(b),e=d.P;d.P=null;c||(c=(a=a.b[b.__shady_slot||"__catchall"])&&a[0]);c?(u(c).assignedNodes.push(b),d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(u(d.assignedSlot).T=!0)}
function Wc(a,b,c){for(var d=0,e=void 0;d<c.length&&(e=c[d]);d++)if("slot"==e.localName){var f=v(e).assignedNodes;f&&f.length&&Wc(a,b,f)}else b.push(c[d])}function Xc(a,b){b.__shady_native_dispatchEvent(new Event("slotchange"));b=v(b);b.assignedSlot&&Xc(a,b.assignedSlot)}
function Uc(a){if(a.c&&a.c.length){for(var b=a.c,c,d=0;d<b.length;d++){var e=b[d];jc(e);var f=e.__shady_parentNode;jc(f);f=v(f);f.N=(f.N||0)+1;f=Yc(e);a.b[f]?(c=c||{},c[f]=!0,a.b[f].push(e)):a.b[f]=[e];a.a.push(e)}if(c)for(var g in c)a.b[g]=Zc(a.b[g]);a.c=[]}}function Yc(a){var b=a.name||a.getAttribute("name")||"__catchall";return a.wa=b}
function Zc(a){return a.sort(function(a,c){a=Rc(a);for(var b=Rc(c),e=0;e<a.length;e++){c=a[e];var f=b[e];if(c!==f)return a=Array.from(c.__shady_parentNode.__shady_childNodes),a.indexOf(c)-a.indexOf(f)}})}
function Bc(a,b){if(a.a){Uc(a);var c=a.b,d;for(d in c)for(var e=c[d],f=0;f<e.length;f++){var g=e[f];if(Ua(b,g)){e.splice(f,1);var h=a.a.indexOf(g);0<=h&&(a.a.splice(h,1),(h=v(g.__shady_parentNode))&&h.N&&h.N--);f--;g=v(g);if(h=g.D)for(var k=0;k<h.length;k++){var l=h[k],m=l.__shady_native_parentNode;m&&m.__shady_native_removeChild(l)}g.D=[];g.assignedNodes=[];h=!0}}return h}}function Ma(a){Uc(a);return!(!a.a||!a.a.length)}
(function(a){a.__proto__=DocumentFragment.prototype;Nc(a,"__shady_");Nc(a);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:"#document-fragment",configurable:!0},nodeValue:{value:null,configurable:!0}});["localName","namespaceURI","prefix"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0})});["ownerDocument","baseURI","isConnected"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},
configurable:!0})})})(Sc.prototype);
if(window.customElements&&w.ea&&!w.preferPerformance){var $c=new Map;Qc=function(){var a=[];$c.forEach(function(b,c){a.push([c,b])});$c.clear();for(var b=0;b<a.length;b++){var c=a[b][0];a[b][1]?c.ua():c.va()}};Pc&&document.addEventListener("readystatechange",function(){Pc=!1;Qc()},{once:!0});var ad=function(a,b,c){var d=0,e="__isConnected"+d++;if(b||c)a.prototype.connectedCallback=a.prototype.ua=function(){Pc?$c.set(this,!0):this[e]||(this[e]=!0,b&&b.call(this))},a.prototype.disconnectedCallback=
a.prototype.va=function(){Pc?this.isConnected||$c.set(this,!1):this[e]&&(this[e]=!1,c&&c.call(this))};return a},bd=window.customElements.define;Object.defineProperty(window.CustomElementRegistry.prototype,"define",{value:function(a,b){var c=b.prototype.connectedCallback,d=b.prototype.disconnectedCallback;bd.call(window.customElements,a,ad(b,c,d));b.prototype.connectedCallback=c;b.prototype.disconnectedCallback=d}})}function xc(a){a=a.__shady_getRootNode();if(z(a))return a};function cd(a){this.node=a}n=cd.prototype;n.addEventListener=function(a,b,c){return this.node.__shady_addEventListener(a,b,c)};n.removeEventListener=function(a,b,c){return this.node.__shady_removeEventListener(a,b,c)};n.appendChild=function(a){return this.node.__shady_appendChild(a)};n.insertBefore=function(a,b){return this.node.__shady_insertBefore(a,b)};n.removeChild=function(a){return this.node.__shady_removeChild(a)};n.replaceChild=function(a,b){return this.node.__shady_replaceChild(a,b)};
n.cloneNode=function(a){return this.node.__shady_cloneNode(a)};n.getRootNode=function(a){return this.node.__shady_getRootNode(a)};n.contains=function(a){return this.node.__shady_contains(a)};n.dispatchEvent=function(a){return this.node.__shady_dispatchEvent(a)};n.setAttribute=function(a,b){this.node.__shady_setAttribute(a,b)};n.getAttribute=function(a){return this.node.__shady_native_getAttribute(a)};n.hasAttribute=function(a){return this.node.__shady_native_hasAttribute(a)};n.removeAttribute=function(a){this.node.__shady_removeAttribute(a)};
n.attachShadow=function(a){return this.node.__shady_attachShadow(a)};n.focus=function(){this.node.__shady_native_focus()};n.blur=function(){this.node.__shady_blur()};n.importNode=function(a,b){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_importNode(a,b)};n.getElementById=function(a){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_getElementById(a)};n.querySelector=function(a){return this.node.__shady_querySelector(a)};
n.querySelectorAll=function(a,b){return this.node.__shady_querySelectorAll(a,b)};n.assignedNodes=function(a){if("slot"===this.node.localName)return this.node.__shady_assignedNodes(a)};
p.Object.defineProperties(cd.prototype,{activeElement:{configurable:!0,enumerable:!0,get:function(){if(z(this.node)||this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_activeElement}},_activeElement:{configurable:!0,enumerable:!0,get:function(){return this.activeElement}},host:{configurable:!0,enumerable:!0,get:function(){if(z(this.node))return this.node.host}},parentNode:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_parentNode}},firstChild:{configurable:!0,
enumerable:!0,get:function(){return this.node.__shady_firstChild}},lastChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastChild}},nextSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextSibling}},previousSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousSibling}},childNodes:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childNodes}},parentElement:{configurable:!0,enumerable:!0,
get:function(){return this.node.__shady_parentElement}},firstElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_firstElementChild}},lastElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastElementChild}},nextElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextElementSibling}},previousElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousElementSibling}},
children:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_children}},childElementCount:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childElementCount}},shadowRoot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_shadowRoot}},assignedSlot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_assignedSlot}},isConnected:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_isConnected}},innerHTML:{configurable:!0,
enumerable:!0,get:function(){return this.node.__shady_innerHTML},set:function(a){this.node.__shady_innerHTML=a}},textContent:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_textContent},set:function(a){this.node.__shady_textContent=a}},slot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_slot},set:function(a){this.node.__shady_slot=a}}});
cc.forEach(function(a){Object.defineProperty(cd.prototype,a,{get:function(){return this.node["__shady_"+a]},set:function(b){this.node["__shady_"+a]=b},configurable:!0})});var dd=new WeakMap;function ed(a){if(z(a)||a instanceof cd)return a;var b=dd.get(a);b||(b=new cd(a),dd.set(a,b));return b};var fd=B({dispatchEvent:function(a){Za();return this.__shady_native_dispatchEvent(a)},addEventListener:Ub,removeEventListener:Wb});var gd=B({get assignedSlot(){var a=this.__shady_parentNode;(a=a&&a.__shady_shadowRoot)&&Tc(a);return(a=v(this))&&a.assignedSlot||null}});var hd=window.document;function id(a,b){if("slot"===b)a=a.__shady_parentNode,La(a)&&Ac(v(a).root);else if("slot"===a.localName&&"name"===b&&(b=xc(a))){if(b.a){Uc(b);var c=a.wa,d=Yc(a);if(d!==c){c=b.b[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.b[d]||(b.b[d]=[]);c.push(a);1<c.length&&(b.b[d]=Zc(c))}}Ac(b)}}
var jd=B({get previousElementSibling(){var a=v(this);if(a&&void 0!==a.previousSibling){for(a=this.__shady_previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_previousElementSibling},get nextElementSibling(){var a=v(this);if(a&&void 0!==a.nextSibling){for(a=this.__shady_nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_nextElementSibling},get slot(){return this.getAttribute("slot")},
set slot(a){this.__shady_setAttribute("slot",a)},get shadowRoot(){var a=v(this);return a&&a.pa||null},get className(){return this.getAttribute("class")||""},set className(a){this.__shady_setAttribute("class",a)},setAttribute:function(a,b){if(this.ownerDocument!==hd)this.__shady_native_setAttribute(a,b);else{var c;(c=G())&&"class"===a?(c.setElementClass(this,b),c=!0):c=!1;c||(this.__shady_native_setAttribute(a,b),id(this,a))}},removeAttribute:function(a){this.__shady_native_removeAttribute(a);id(this,
a)},attachShadow:function(a){if(!this)throw Error("Must provide a host.");if(!a)throw Error("Not enough arguments.");return new Sc(Oc,this,a)}});var kd=B({blur:function(){var a=v(this);(a=(a=a&&a.root)&&a.activeElement)?a.__shady_blur():this.__shady_native_blur()}});cc.forEach(function(a){kd[a]={set:function(b){var c=u(this),d=a.substring(2);c.O[a]&&this.removeEventListener(d,c.O[a]);this.__shady_addEventListener(d,b);c.O[a]=b},get:function(){var b=v(this);return b&&b.O[a]},configurable:!0}});var ld=B({assignedNodes:function(a){if("slot"===this.localName){var b=this.__shady_getRootNode();b&&z(b)&&Tc(b);return(b=v(this))?(a&&a.flatten?b.D:b.assignedNodes)||[]:[]}}});var md=window.document,nd=B({importNode:function(a,b){if(a.ownerDocument!==md||"template"===a.localName)return this.__shady_native_importNode(a,b);var c=this.__shady_native_importNode(a,!1);if(b){a=a.__shady_childNodes;b=0;for(var d;b<a.length;b++)d=this.__shady_importNode(a[b],!0),c.__shady_appendChild(d)}return c}});var od=B({addEventListener:Ub.bind(window),removeEventListener:Wb.bind(window)});var pd={};Object.getOwnPropertyDescriptor(HTMLElement.prototype,"parentElement")&&(pd.parentElement=Cc.parentElement);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"contains")&&(pd.contains=Cc.contains);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"children")&&(pd.children=Fc.children);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"innerHTML")&&(pd.innerHTML=Lc.innerHTML);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"className")&&(pd.className=jd.className);
var qd={EventTarget:[fd],Node:[Cc,window.EventTarget?null:fd],Text:[gd],Element:[jd,Fc,gd,!w.m||"innerHTML"in Element.prototype?Lc:null,window.HTMLSlotElement?null:ld],HTMLElement:[kd,pd],HTMLSlotElement:[ld],DocumentFragment:[Hc,Ic],Document:[nd,Hc,Ic,Jc],Window:[od]},rd=w.m?null:["innerHTML","textContent"];function sd(a){var b=a?null:rd,c={},d;for(d in qd)c.W=window[d]&&window[d].prototype,qd[d].forEach(function(c){return function(d){return c.W&&d&&A(c.W,d,a,b)}}(c)),c={W:c.W}};if(w.ea){var ShadyDOM={inUse:w.ea,patch:function(a){Fb(a);Eb(a);return a},isShadyRoot:z,enqueue:Ya,flush:Za,flushInitial:function(a){!a.ba&&a.B&&Tc(a)},settings:w,filterMutations:db,observeChildren:bb,unobserveChildren:cb,deferConnectionCallbacks:w.deferConnectionCallbacks,preferPerformance:w.preferPerformance,handlesDynamicScoping:!0,wrap:w.J?ed:function(a){return a},Wrapper:cd,composedPath:Mb,noPatch:w.J,nativeMethods:qb,nativeTree:rb};window.ShadyDOM=ShadyDOM;yb();sd("__shady_");Object.defineProperty(document,
"_activeElement",Jc.activeElement);A(Window.prototype,od,"__shady_");w.J||(sd(),bc());Xb();window.Event=Zb;window.CustomEvent=$b;window.MouseEvent=ac;window.ShadowRoot=Sc};var td=new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));function ud(a){var b=td.has(a);a=/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a);return!b&&a}function H(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}
function vd(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
function wd(a,b,c){c=void 0===c?new Set:c;for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)wd(d,b,c);d=vd(a,e);continue}else if("template"===f){d=vd(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)wd(e,b,c)}d=d.firstChild?d.firstChild:vd(a,d)}}function I(a,b,c){a[b]=c};function xd(){this.a=new Map;this.g=new Map;this.f=[];this.c=!1}function yd(a,b,c){a.a.set(b,c);a.g.set(c.constructorFunction,c)}function zd(a,b){a.c=!0;a.f.push(b)}function Ad(a,b){a.c&&wd(b,function(b){return a.b(b)})}xd.prototype.b=function(a){if(this.c&&!a.__CE_patched){a.__CE_patched=!0;for(var b=0;b<this.f.length;b++)this.f[b](a)}};function J(a,b){var c=[];wd(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):Bd(a,d)}}
function K(a,b){var c=[];wd(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d)}}
function L(a,b,c){c=void 0===c?{}:c;var d=c.Xa||new Set,e=c.Y||function(b){return Bd(a,b)},f=[];wd(b,function(b){if("link"===b.localName&&"import"===b.getAttribute("rel")){var c=b.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&"complete"===c.readyState?c.__CE_documentLoadHandled=!0:b.addEventListener("load",function(){var c=b.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);L(a,c,{Xa:f,Y:e})}})}else f.push(b)},d);if(a.c)for(b=
0;b<f.length;b++)a.b(f[b]);for(b=0;b<f.length;b++)e(f[b])}
function Bd(a,b){if(void 0===b.__CE_state){var c=b.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=a.a.get(b.localName)){c.constructionStack.push(b);var d=c.constructorFunction;try{try{if(new d!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{c.constructionStack.pop()}}catch(g){throw b.__CE_state=2,g;}b.__CE_state=1;b.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=
c[d],f=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null)}H(b)&&a.connectedCallback(b)}}}xd.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a)};xd.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a)};
xd.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,c,d,e)};function Cd(a){var b=document;this.b=a;this.a=b;this.F=void 0;L(this.b,this.a);"loading"===this.a.readyState&&(this.F=new MutationObserver(this.c.bind(this)),this.F.observe(this.a,{childList:!0,subtree:!0}))}function Dd(a){a.F&&a.F.disconnect()}Cd.prototype.c=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||Dd(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)L(this.b,c[d])};function Ed(){var a=this;this.a=this.h=void 0;this.b=new Promise(function(b){a.a=b;a.h&&b(a.h)})}Ed.prototype.resolve=function(a){if(this.h)throw Error("Already resolved.");this.h=a;this.a&&this.a(a)};function N(a){this.c=!1;this.a=a;this.l=new Map;this.f=function(a){return a()};this.b=!1;this.g=[];this.da=new Cd(a)}n=N.prototype;
n.sa=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");if(!ud(a))throw new SyntaxError("The element name '"+a+"' is not valid.");if(this.a.a.get(a))throw Error("A custom element with name '"+a+"' has already been defined.");if(this.c)throw Error("A custom element is already being defined.");this.c=!0;try{var d=function(a){var b=e[a];if(void 0!==b&&!(b instanceof Function))throw Error("The '"+a+"' callback must be a function.");
return b},e=b.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=d("connectedCallback");var g=d("disconnectedCallback");var h=d("adoptedCallback");var k=d("attributeChangedCallback");var l=b.observedAttributes||[]}catch(m){return}finally{this.c=!1}b={localName:a,constructorFunction:b,connectedCallback:f,disconnectedCallback:g,adoptedCallback:h,attributeChangedCallback:k,observedAttributes:l,constructionStack:[]};yd(this.a,
a,b);this.g.push(b);this.b||(this.b=!0,this.f(function(){return Fd(c)}))};n.Y=function(a){L(this.a,a)};
function Fd(a){if(!1!==a.b){a.b=!1;for(var b=a.g,c=[],d=new Map,e=0;e<b.length;e++)d.set(b[e].localName,[]);L(a.a,document,{Y:function(b){if(void 0===b.__CE_state){var e=b.localName,f=d.get(e);f?f.push(b):a.a.a.get(e)&&c.push(b)}}});for(e=0;e<c.length;e++)Bd(a.a,c[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=d.get(f.localName);for(var g=0;g<f.length;g++)Bd(a.a,f[g]);(e=a.l.get(e))&&e.resolve(void 0)}}}n.get=function(a){if(a=this.a.a.get(a))return a.constructorFunction};
n.ta=function(a){if(!ud(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.l.get(a);if(b)return b.b;b=new Ed;this.l.set(a,b);this.a.a.get(a)&&!this.g.some(function(b){return b.localName===a})&&b.resolve(void 0);return b.b};n.Pa=function(a){Dd(this.da);var b=this.f;this.f=function(c){return a(function(){return b(c)})}};window.CustomElementRegistry=N;N.prototype.define=N.prototype.sa;N.prototype.upgrade=N.prototype.Y;N.prototype.get=N.prototype.get;
N.prototype.whenDefined=N.prototype.ta;N.prototype.polyfillWrapFlushCallback=N.prototype.Pa;var Gd=window.Document.prototype.createElement,Hd=window.Document.prototype.createElementNS,Id=window.Document.prototype.importNode,Jd=window.Document.prototype.prepend,Kd=window.Document.prototype.append,Ld=window.DocumentFragment.prototype.prepend,Md=window.DocumentFragment.prototype.append,Nd=window.Node.prototype.cloneNode,Od=window.Node.prototype.appendChild,Pd=window.Node.prototype.insertBefore,Qd=window.Node.prototype.removeChild,Rd=window.Node.prototype.replaceChild,Sd=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),Td=window.Element.prototype.attachShadow,Ud=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Vd=window.Element.prototype.getAttribute,Wd=window.Element.prototype.setAttribute,Xd=window.Element.prototype.removeAttribute,Yd=window.Element.prototype.getAttributeNS,Zd=window.Element.prototype.setAttributeNS,$d=window.Element.prototype.removeAttributeNS,ae=window.Element.prototype.insertAdjacentElement,be=window.Element.prototype.insertAdjacentHTML,ce=window.Element.prototype.prepend,
de=window.Element.prototype.append,ee=window.Element.prototype.before,fe=window.Element.prototype.after,ge=window.Element.prototype.replaceWith,he=window.Element.prototype.remove,ie=window.HTMLElement,je=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),ke=window.HTMLElement.prototype.insertAdjacentElement,le=window.HTMLElement.prototype.insertAdjacentHTML;var me=new function(){};function ne(){var a=oe;window.HTMLElement=function(){function b(){var b=this.constructor,d=a.g.get(b);if(!d)throw Error("The custom element being constructed was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=Gd.call(document,d.localName),Object.setPrototypeOf(e,b.prototype),e.__CE_state=1,e.__CE_definition=d,a.b(e),e;d=e.length-1;var f=e[d];if(f===me)throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
e[d]=me;Object.setPrototypeOf(f,b.prototype);a.b(f);return f}b.prototype=ie.prototype;Object.defineProperty(b.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});return b}()};function pe(a,b,c){function d(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var f=[],l=0;l<d.length;l++){var m=d[l];m instanceof Element&&H(m)&&f.push(m);if(m instanceof DocumentFragment)for(m=m.firstChild;m;m=m.nextSibling)e.push(m);else e.push(m)}b.apply(this,d);for(d=0;d<f.length;d++)K(a,f[d]);if(H(this))for(d=0;d<e.length;d++)f=e[d],f instanceof Element&&J(a,f)}}void 0!==c.V&&(b.prepend=d(c.V));void 0!==c.append&&(b.append=d(c.append))};function qe(){var a=oe;I(Document.prototype,"createElement",function(b){if(this.__CE_hasRegistry){var c=a.a.get(b);if(c)return new c.constructorFunction}b=Gd.call(this,b);a.b(b);return b});I(Document.prototype,"importNode",function(b,c){b=Id.call(this,b,!!c);this.__CE_hasRegistry?L(a,b):Ad(a,b);return b});I(Document.prototype,"createElementNS",function(b,c){if(this.__CE_hasRegistry&&(null===b||"http://www.w3.org/1999/xhtml"===b)){var d=a.a.get(c);if(d)return new d.constructorFunction}b=Hd.call(this,
b,c);a.b(b);return b});pe(a,Document.prototype,{V:Jd,append:Kd})};function re(){function a(a,d){Object.defineProperty(a,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(a){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,a);else{var c=void 0;if(this.firstChild){var e=this.childNodes,h=e.length;if(0<h&&H(this)){c=Array(h);for(var k=0;k<h;k++)c[k]=e[k]}}d.set.call(this,a);if(c)for(a=0;a<c.length;a++)K(b,c[a])}}})}var b=oe;I(Node.prototype,"insertBefore",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);
a=Pd.call(this,a,d);if(H(this))for(d=0;d<c.length;d++)J(b,c[d]);return a}c=H(a);d=Pd.call(this,a,d);c&&K(b,a);H(this)&&J(b,a);return d});I(Node.prototype,"appendChild",function(a){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=Od.call(this,a);if(H(this))for(var e=0;e<c.length;e++)J(b,c[e]);return a}c=H(a);e=Od.call(this,a);c&&K(b,a);H(this)&&J(b,a);return e});I(Node.prototype,"cloneNode",function(a){a=Nd.call(this,!!a);this.ownerDocument.__CE_hasRegistry?L(b,a):
Ad(b,a);return a});I(Node.prototype,"removeChild",function(a){var c=H(a),e=Qd.call(this,a);c&&K(b,a);return e});I(Node.prototype,"replaceChild",function(a,d){if(a instanceof DocumentFragment){var c=Array.prototype.slice.apply(a.childNodes);a=Rd.call(this,a,d);if(H(this))for(K(b,d),d=0;d<c.length;d++)J(b,c[d]);return a}c=H(a);var f=Rd.call(this,a,d),g=H(this);g&&K(b,d);c&&K(b,a);g&&J(b,a);return f});Sd&&Sd.get?a(Node.prototype,Sd):zd(b,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){for(var a=
[],b=0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join("")},set:function(a){for(;this.firstChild;)Qd.call(this,this.firstChild);Od.call(this,document.createTextNode(a))}})})};function se(a){function b(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e]=arguments[e];e=[];for(var h=[],k=0;k<d.length;k++){var l=d[k];l instanceof Element&&H(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)e.push(l);else e.push(l)}b.apply(this,d);for(d=0;d<h.length;d++)K(a,h[d]);if(H(this))for(d=0;d<e.length;d++)h=e[d],h instanceof Element&&J(a,h)}}var c=Element.prototype;void 0!==ee&&(c.before=b(ee));void 0!==ee&&(c.after=b(fe));void 0!==ge&&
I(c,"replaceWith",function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=[];for(var g=[],h=0;h<c.length;h++){var k=c[h];k instanceof Element&&H(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)d.push(k);else d.push(k)}h=H(this);ge.apply(this,c);for(c=0;c<g.length;c++)K(a,g[c]);if(h)for(K(a,this),c=0;c<d.length;c++)g=d[c],g instanceof Element&&J(a,g)});void 0!==he&&I(c,"remove",function(){var b=H(this);he.call(this);b&&K(a,this)})};function te(){function a(a,b){Object.defineProperty(a,"innerHTML",{enumerable:b.enumerable,configurable:!0,get:b.get,set:function(a){var c=this,e=void 0;H(this)&&(e=[],wd(this,function(a){a!==c&&e.push(a)}));b.set.call(this,a);if(e)for(var f=0;f<e.length;f++){var g=e[f];1===g.__CE_state&&d.disconnectedCallback(g)}this.ownerDocument.__CE_hasRegistry?L(d,this):Ad(d,this);return a}})}function b(a,b){I(a,"insertAdjacentElement",function(a,c){var e=H(c);a=b.call(this,a,c);e&&K(d,c);H(a)&&J(d,c);return a})}
function c(a,b){function c(a,b){for(var c=[];a!==b;a=a.nextSibling)c.push(a);for(b=0;b<c.length;b++)L(d,c[b])}I(a,"insertAdjacentHTML",function(a,d){a=a.toLowerCase();if("beforebegin"===a){var e=this.previousSibling;b.call(this,a,d);c(e||this.parentNode.firstChild,this)}else if("afterbegin"===a)e=this.firstChild,b.call(this,a,d),c(this.firstChild,e);else if("beforeend"===a)e=this.lastChild,b.call(this,a,d),c(e||this.firstChild,null);else if("afterend"===a)e=this.nextSibling,b.call(this,a,d),c(this.nextSibling,
e);else throw new SyntaxError("The value provided ("+String(a)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");})}var d=oe;Td&&I(Element.prototype,"attachShadow",function(a){return this.__CE_shadowRoot=a=Td.call(this,a)});Ud&&Ud.get?a(Element.prototype,Ud):je&&je.get?a(HTMLElement.prototype,je):zd(d,function(b){a(b,{enumerable:!0,configurable:!0,get:function(){return Nd.call(this,!0).innerHTML},set:function(a){var b="template"===this.localName,c=b?this.content:this,d=Hd.call(document,
this.namespaceURI,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)Qd.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)Od.call(c,a.childNodes[0])}})});I(Element.prototype,"setAttribute",function(a,b){if(1!==this.__CE_state)return Wd.call(this,a,b);var c=Vd.call(this,a);Wd.call(this,a,b);b=Vd.call(this,a);d.attributeChangedCallback(this,a,c,b,null)});I(Element.prototype,"setAttributeNS",function(a,b,c){if(1!==this.__CE_state)return Zd.call(this,a,b,c);var e=Yd.call(this,a,
b);Zd.call(this,a,b,c);c=Yd.call(this,a,b);d.attributeChangedCallback(this,b,e,c,a)});I(Element.prototype,"removeAttribute",function(a){if(1!==this.__CE_state)return Xd.call(this,a);var b=Vd.call(this,a);Xd.call(this,a);null!==b&&d.attributeChangedCallback(this,a,b,null,null)});I(Element.prototype,"removeAttributeNS",function(a,b){if(1!==this.__CE_state)return $d.call(this,a,b);var c=Yd.call(this,a,b);$d.call(this,a,b);var e=Yd.call(this,a,b);c!==e&&d.attributeChangedCallback(this,b,c,e,a)});ke?b(HTMLElement.prototype,
ke):ae?b(Element.prototype,ae):console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched.");le?c(HTMLElement.prototype,le):be?c(Element.prototype,be):console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched.");pe(d,Element.prototype,{V:ce,append:de});se(d)};var ue=window.customElements;if(!ue||ue.forcePolyfill||"function"!=typeof ue.define||"function"!=typeof ue.get){var oe=new xd;ne();qe();pe(oe,DocumentFragment.prototype,{V:Ld,append:Md});re();te();document.__CE_hasRegistry=!0;var customElements=new N(oe);Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:customElements})};function ve(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName=""}
function we(a){a=a.replace(xe,"").replace(ye,"");var b=ze,c=a,d=new ve;d.start=0;d.end=c.length;for(var e=d,f=0,g=c.length;f<g;f++)if("{"===c[f]){e.rules||(e.rules=[]);var h=e,k=h.rules[h.rules.length-1]||null;e=new ve;e.start=f+1;e.parent=h;e.previous=k;h.rules.push(e)}else"}"===c[f]&&(e.end=f+1,e=e.parent||d);return b(d,a)}
function ze(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=Ae(c),c=c.replace(Be," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=Ce:c.match(De)&&(a.type=Ee,a.keyframesName=a.selector.split(Be).pop()):a.type=0===c.indexOf("--")?Fe:Ge);if(c=a.rules)for(var d=0,e=c.length,f=void 0;d<e&&(f=c[d]);d++)ze(f,
b);return a}function Ae(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return"\\"+a})}
function He(a,b,c){c=void 0===c?"":c;var d="";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=e.length,h=void 0;f<g&&(h=e[f]);f++)d=He(h,b,d)}else b?b=a.cssText:(b=a.cssText,b=b.replace(Ie,"").replace(Je,""),b=b.replace(Ke,"").replace(Le,"")),(d=b.trim())&&(d="  "+d+"\n")}d&&(a.selector&&(c+=a.selector+" {\n"),c+=d,a.selector&&(c+="}\n\n"));return c}
var Ge=1,Ee=7,Ce=4,Fe=1E3,xe=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,ye=/@import[^;]*;/gim,Ie=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,Je=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,Ke=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,Le=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,De=/^@[^\s]*keyframes/,Be=/\s+/g;var O=!(window.ShadyDOM&&window.ShadyDOM.inUse),Me;function Ne(a){Me=a&&a.shimcssproperties?!1:O||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"))}var Oe;window.ShadyCSS&&void 0!==window.ShadyCSS.cssBuild&&(Oe=window.ShadyCSS.cssBuild);var Pe=!(!window.ShadyCSS||!window.ShadyCSS.disableRuntime);
window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?Me=window.ShadyCSS.nativeCss:window.ShadyCSS?(Ne(window.ShadyCSS),window.ShadyCSS=void 0):Ne(window.WebComponents&&window.WebComponents.flags);var Q=Me,Qe=Oe;var Re=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,Se=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,Te=/(--[\w-]+)\s*([:,;)]|$)/gi,Ue=/(animation\s*:)|(animation-name\s*:)/,$e=/@media\s(.*)/,af=/\{[^}]*\}/g;var bf=new Set;function cf(a,b){if(!a)return"";"string"===typeof a&&(a=we(a));b&&df(a,b);return He(a,Q)}function ef(a){!a.__cssRules&&a.textContent&&(a.__cssRules=we(a.textContent));return a.__cssRules||null}function ff(a){return!!a.parent&&a.parent.type===Ee}function df(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===Ce){var g=a.selector.match($e);g&&(window.matchMedia(g[1]).matches||(e=!0))}f===Ge?b(a):c&&f===Ee?c(a):f===Fe&&(e=!0);if((a=a.rules)&&!e)for(e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++)df(g,b,c,d)}}
function gf(a,b,c,d){var e=document.createElement("style");b&&e.setAttribute("scope",b);e.textContent=a;hf(e,c,d);return e}var jf=null;function kf(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(jf?jf.nextSibling:null)||b.firstChild);return jf=a}function hf(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);jf?a.compareDocumentPosition(jf)===Node.DOCUMENT_POSITION_PRECEDING&&(jf=a):jf=a}
function lf(a,b){for(var c=0,d=a.length;b<d;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return-1}function mf(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var d=lf(a,c+3),e=a.substring(c+4,d);c=a.substring(0,c);a=mf(a.substring(d+1),b);d=e.indexOf(",");return-1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function nf(a,b){O?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b)}
var of=window.ShadyDOM&&window.ShadyDOM.wrap||function(a){return a};function pf(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return{is:b,M:c}}function qf(a){for(var b=[],c="",d=0;0<=d&&d<a.length;d++)if("("===a[d]){var e=lf(a,d);c+=a.slice(d,e+1);d=e}else","===a[d]?(b.push(c),c=""):c+=a[d];c&&b.push(c);return b}
function rf(a){if(void 0!==Qe)return Qe;if(void 0===a.__cssBuild){var b=a.getAttribute("css-build");if(b)a.__cssBuild=b;else{a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"),"css-build"===b[0])){b=b[1];break a}b=""}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c)}a.__cssBuild=b}}return a.__cssBuild||""}
function sf(a){a=void 0===a?"":a;return""!==a&&Q?O?"shadow"===a:"shady"===a:!1};function tf(){}function uf(a,b){vf(R,a,function(a){wf(a,b||"")})}function vf(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);var d;"template"===b.localName?d=(b.content||b._content||b).childNodes:d=b.children||b.childNodes;if(d)for(b=0;b<d.length;b++)vf(a,d[b],c)}
function wf(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute("class");c?d&&(b=d.replace("style-scope","").replace(b,""),nf(a,b)):nf(a,(d?d+" ":"")+"style-scope "+b)}}function xf(a,b,c){vf(R,a,function(a){wf(a,b,!0);wf(a,c)})}function yf(a,b){vf(R,a,function(a){wf(a,b||"",!0)})}
function zf(a,b,c,d,e){var f=R;e=void 0===e?"":e;""===e&&(O||"shady"===(void 0===d?"":d)?e=cf(b,c):(a=pf(a),e=Af(f,b,a.is,a.M,c)+"\n\n"));return e.trim()}function Af(a,b,c,d,e){var f=Bf(c,d);c=c?"."+c:"";return cf(b,function(b){b.c||(b.selector=b.j=Cf(a,b,a.b,c,f),b.c=!0);e&&e(b,c,f)})}function Bf(a,b){return b?"[is="+a+"]":a}
function Cf(a,b,c,d,e){var f=qf(b.selector);if(!ff(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,d,e)}return f.filter(function(a){return!!a}).join(",")}function Df(a){return a.replace(Ef,function(a,c,d){-1<d.indexOf("+")?d=d.replace(/\+/g,"___"):-1<d.indexOf("___")&&(d=d.replace(/___/g,"+"));return":"+c+"("+d+")"})}
function Ff(a){for(var b=[],c;c=a.match(Gf);){var d=c.index,e=lf(a,d);if(-1===e)throw Error(c.input+" selector missing ')'");c=a.slice(d,e+1);a=a.replace(c,"\ue000");b.push(c)}return{ha:a,matches:b}}function Hf(a,b){var c=a.split("\ue000");return b.reduce(function(a,b,f){return a+b+c[f+1]},c[0])}
tf.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=Ef.test(a);e&&(a=a.replace(Ef,function(a,b,c){return":"+b+"("+c.replace(/\s/g,"")+")"}),a=Df(a));var f=Gf.test(a);if(f){var g=Ff(a);a=g.ha;g=g.matches}a=a.replace(If,":host $1");a=a.replace(Jf,function(a,e,f){d||(a=Kf(f,e,b,c),d=d||a.stop,e=a.Ca,f=a.value);return e+f});f&&(a=Hf(a,g));e&&(a=Df(a));return a};
function Kf(a,b,c,d){var e=a.indexOf("::slotted");0<=a.indexOf(":host")?a=Lf(a,d):0!==e&&(a=c?Mf(a,c):a);c=!1;0<=e&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(Nf,function(a,b){return" > "+b}))}a=a.replace(Of,function(a,b,c){return'[dir="'+c+'"] '+b+", "+b+'[dir="'+c+'"]'});return{value:a,Ca:b,stop:f}}
function Mf(a,b){a=a.split(/(\[.+?\])/);for(var c=[],d=0;d<a.length;d++)if(1===d%2)c.push(a[d]);else{var e=a[d];if(""!==e||d!==a.length-1)e=e.split(":"),e[0]+=b,c.push(e.join(":"))}return c.join("")}function Lf(a,b){var c=a.match(Pf);return(c=c&&c[2].trim()||"")?c[0].match(Qf)?a.replace(Pf,function(a,c,f){return b+f}):c.split(Qf)[0]===b?c:"should_not_match":a.replace(":host",b)}function Rf(a){":root"===a.selector&&(a.selector="html")}
tf.prototype.c=function(a){return a.match(":host")?"":a.match("::slotted")?this.b(a,":not(.style-scope)"):Mf(a.trim(),":not(.style-scope)")};p.Object.defineProperties(tf.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"style-scope"}}});
var Ef=/:(nth[-\w]+)\(([^)]+)\)/,Jf=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,Qf=/[[.:#*]/,If=/^(::slotted)/,Pf=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Nf=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Of=/(.*):dir\((?:(ltr|rtl))\)/,Gf=/:(?:matches|any|-(?:webkit|moz)-any)/,R=new tf;function Sf(a,b,c,d,e){this.A=a||null;this.b=b||null;this.fa=c||[];this.o=null;this.cssBuild=e||"";this.M=d||"";this.a=this.s=this.w=null}function T(a){return a?a.__styleInfo:null}function Tf(a,b){return a.__styleInfo=b}Sf.prototype.c=function(){return this.A};Sf.prototype._getStyleRules=Sf.prototype.c;function Uf(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var Vf=navigator.userAgent.match("Trident");function Wf(){}function Xf(a){var b={},c=[],d=0;df(a,function(a){Yf(a);a.index=d++;a=a.i.cssText;for(var c;c=Te.exec(a);){var e=c[1];":"!==c[2]&&(b[e]=!0)}},function(a){c.push(a)});a.b=c;a=[];for(var e in b)a.push(e);return a}
function Yf(a){if(!a.i){var b={},c={};Zf(a,c)&&(b.v=c,a.rules=null);b.cssText=a.parsedCssText.replace(af,"").replace(Re,"");a.i=b}}function Zf(a,b){var c=a.i;if(c){if(c.v)return Object.assign(b,c.v),!0}else{c=a.parsedCssText;for(var d;a=Re.exec(c);){d=(a[2]||a[3]).trim();if("inherit"!==d||"unset"!==d)b[a[1].trim()]=d;d=!0}return d}}
function $f(a,b,c){b&&(b=0<=b.indexOf(";")?ag(a,b,c):mf(b,function(b,e,f,g){if(!e)return b+g;(e=$f(a,c[e],c))&&"initial"!==e?"apply-shim-inherit"===e&&(e="inherit"):e=$f(a,c[f]||f,c)||f;return b+(e||"")+g}));return b&&b.trim()||""}
function ag(a,b,c){b=b.split(";");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){Se.lastIndex=0;if(f=Se.exec(e))e=$f(a,c[f[1]],c);else if(f=e.indexOf(":"),-1!==f){var g=e.substring(f);g=g.trim();g=$f(a,g,c)||g;e=e.substring(0,f)+g}b[d]=e&&e.lastIndexOf(";")===e.length-1?e.slice(0,-1):e||""}return b.join(";")}
function bg(a,b){var c={},d=[];df(a,function(a){a.i||Yf(a);var e=a.j||a.parsedSelector;b&&a.i.v&&e&&Uf.call(b,e)&&(Zf(a,c),a=a.index,e=parseInt(a/32,10),d[e]=(d[e]||0)|1<<a%32)},null,!0);return{v:c,key:d}}
function cg(a,b,c,d){b.i||Yf(b);if(b.i.v){var e=pf(a);a=e.is;e=e.M;e=a?Bf(a,e):"html";var f=b.parsedSelector,g=":host > *"===f||"html"===f,h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===e+" > *."+e||-1!==f.indexOf("html"),h=!g&&0===f.indexOf(e));if(g||h)c=e,h&&(b.j||(b.j=Cf(R,b,R.b,a?"."+a:"",e)),c=b.j||e),d({ha:c,Ia:h,Za:g})}}function dg(a,b,c){var d={},e={};df(b,function(b){cg(a,b,c,function(c){Uf.call(a._element||a,c.ha)&&(c.Ia?Zf(b,d):Zf(b,e))})},null,!0);return{Ra:e,Ha:d}}
function eg(a,b,c,d){var e=pf(b),f=Bf(e.is,e.M),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=T(b);e=h.A;h=h.cssBuild;var k=fg(e,d);return zf(b,e,function(b){var e="";b.i||Yf(b);b.i.cssText&&(e=ag(a,b.i.cssText,c));b.cssText=e;if(!O&&!ff(b)&&b.cssText){var h=e=b.cssText;null==b.na&&(b.na=Ue.test(e));if(b.na)if(null==b.U){b.U=[];for(var l in k)h=k[l],h=h(e),e!==h&&(e=h,b.U.push(l))}else{for(l=0;l<b.U.length;++l)h=k[b.U[l]],e=h(e);h=e}b.cssText=h;b.j=b.j||
b.selector;e="."+d;l=qf(b.j);h=0;for(var M=l.length,U=void 0;h<M&&(U=l[h]);h++)l[h]=U.match(g)?U.replace(f,e):e+" "+U;b.selector=l.join(",")}},h)}function fg(a,b){a=a.b;var c={};if(!O&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,g=b;f.f=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.j=f.j||f.selector;f.selector=f.j.replace(f.keyframesName,f.a);c[e.keyframesName]=gg(e)}return c}function gg(a){return function(b){return b.replace(a.f,a.a)}}
function hg(a,b){var c=ig,d=ef(a);a.textContent=cf(d,function(a){var d=a.cssText=a.parsedCssText;a.i&&a.i.cssText&&(d=d.replace(Ie,"").replace(Je,""),a.cssText=ag(c,d,b))})}p.Object.defineProperties(Wf.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"x-scope"}}});var ig=new Wf;var jg={},kg=window.customElements;if(kg&&!O&&!Pe){var lg=kg.define;kg.define=function(a,b,c){jg[a]||(jg[a]=kf(a));lg.call(kg,a,b,c)}};function mg(){this.cache={}}mg.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({v:b,styleElement:c,s:d});100<e.length&&e.shift();this.cache[a]=e};function ng(){}var og=new RegExp(R.a+"\\s*([^\\s]*)");function pg(a){return(a=(a.classList&&a.classList.value?a.classList.value:a.getAttribute("class")||"").match(og))?a[1]:""}function qg(a){var b=of(a).getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?pf(a).is:""}
function rg(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode(),g=pg(e);if(g&&f===e.ownerDocument&&("style"!==e.localName&&"template"!==e.localName||""===rf(e)))yf(e,g);else if(f instanceof ShadowRoot)for(f=qg(e),f!==g&&xf(e,g,f),e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,":not(."+R.a+")"),g=0;g<e.length;g++){f=e[g];
var h=qg(f);h&&wf(f,h)}}}}}
if(!(O||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var sg=new MutationObserver(rg),tg=function(a){sg.observe(a,{childList:!0,subtree:!0})};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)tg(document);else{var ug=function(){tg(document.body)};window.HTMLImports?window.HTMLImports.whenReady(ug):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){ug();document.removeEventListener("readystatechange",a)};document.addEventListener("readystatechange",
a)}else ug()})}ng=function(){rg(sg.takeRecords())}}var vg=ng;var wg={};var xg=Promise.resolve();function yg(a){if(a=wg[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1}function zg(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function Ag(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a._validating||(a._validating=!0,xg.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a._validating=!1}))};var Bg={},Cg=new mg;function Y(){this.l={};this.c=document.documentElement;var a=new ve;a.rules=[];this.f=Tf(this.c,new Sf(a));this.g=!1;this.b=this.a=null}n=Y.prototype;n.flush=function(){vg()};n.Fa=function(a){return ef(a)};n.Va=function(a){return cf(a)};n.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c)};
n.prepareTemplateStyles=function(a,b,c){if(!a._prepared&&!Pe){O||jg[b]||(jg[b]=kf(b));a._prepared=!0;a.name=b;a.extends=c;wg[b]=a;var d=rf(a),e=sf(d);c={is:b,extends:c};for(var f=[],g=a.content.querySelectorAll("style"),h=0;h<g.length;h++){var k=g[h];if(k.hasAttribute("shady-unscoped")){if(!O){var l=k.textContent;bf.has(l)||(bf.add(l),l=k.cloneNode(!0),document.head.appendChild(l));k.parentNode.removeChild(k)}}else f.push(k.textContent),k.parentNode.removeChild(k)}f=f.join("").trim()+(Bg[b]||"");
Dg(this);if(!e){if(g=!d)g=Se.test(f)||Re.test(f),Se.lastIndex=0,Re.lastIndex=0;h=we(f);g&&Q&&this.a&&this.a.transformRules(h,b);a._styleAst=h}g=[];Q||(g=Xf(a._styleAst));if(!g.length||Q)h=O?a.content:null,b=jg[b]||null,d=zf(c,a._styleAst,null,d,e?f:""),d=d.length?gf(d,c.is,h,b):null,a._style=d;a.a=g}};n.Qa=function(a,b){Bg[b]=a.join(" ")};n.prepareTemplateDom=function(a,b){if(!Pe){var c=rf(a);O||"shady"===c||a._domPrepared||(a._domPrepared=!0,uf(a.content,b))}};
function Eg(a){var b=pf(a),c=b.is;b=b.M;var d=jg[c]||null,e=wg[c];if(e){c=e._styleAst;var f=e.a;e=rf(e);b=new Sf(c,d,f,b,e);Tf(a,b);return b}}function Fg(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.ra(b)},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.g)&&a.flushCustomStyles()})})}
function Dg(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=yg);Fg(a)}
n.flushCustomStyles=function(){if(!Pe&&(Dg(this),this.b)){var a=this.b.processStyles();if(this.b.enqueued&&!sf(this.f.cssBuild)){if(Q){if(!this.f.cssBuild)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&Q&&this.a){var d=ef(c);Dg(this);this.a.transformRules(d);c.textContent=cf(d)}}}else{Gg(this,this.c,this.f);for(b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&hg(c,this.f.w);this.g&&this.styleDocument()}this.b.enqueued=!1}}};
n.styleElement=function(a,b){if(Pe){if(b){T(a)||Tf(a,new Sf(null));var c=T(a);c.o=c.o||{};Object.assign(c.o,b);Hg(this,a,c)}}else if(c=T(a)||Eg(a))if(a!==this.c&&(this.g=!0),b&&(c.o=c.o||{},Object.assign(c.o,b)),Q)Hg(this,a,c);else if(this.flush(),Gg(this,a,c),c.fa&&c.fa.length){b=pf(a).is;var d;a:{if(d=Cg.cache[b])for(var e=d.length-1;0<=e;e--){var f=d[e];b:{var g=c.fa;for(var h=0;h<g.length;h++){var k=g[h];if(f.v[k]!==c.w[k]){g=!1;break b}}g=!0}if(g){d=f;break a}}d=void 0}g=d?d.styleElement:null;
e=c.s;(f=d&&d.s)||(f=this.l[b]=(this.l[b]||0)+1,f=b+"-"+f);c.s=f;f=c.s;h=ig;h=g?g.textContent||"":eg(h,a,c.w,f);k=T(a);var l=k.a;l&&!O&&l!==g&&(l._useCount--,0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));O?k.a?(k.a.textContent=h,g=k.a):h&&(g=gf(h,f,a.shadowRoot,k.b)):g?g.parentNode||(Vf&&-1<h.indexOf("@media")&&(g.textContent=h),hf(g,null,k.b)):h&&(g=gf(h,f,null,k.b));g&&(g._useCount=g._useCount||0,k.a!=g&&g._useCount++,k.a=g);f=g;O||(g=c.s,k=h=a.getAttribute("class")||"",e&&(k=h.replace(new RegExp("\\s*x-scope\\s*"+
e+"\\s*","g")," ")),k+=(k?" ":"")+"x-scope "+g,h!==k&&nf(a,k));d||Cg.store(b,c.w,f,c.s)}};
function Hg(a,b,c){var d=pf(b).is;if(c.o){var e=c.o,f;for(f in e)null===f?b.style.removeProperty(f):b.style.setProperty(f,e[f])}e=wg[d];if(!(!e&&b!==a.c||e&&""!==rf(e))&&e&&e._style&&!zg(e)){if(zg(e)||e._applyShimValidatingVersion!==e._applyShimNextVersion)Dg(a),a.a&&a.a.transformRules(e._styleAst,d),e._style.textContent=zf(b,c.A),Ag(e);O&&(a=b.shadowRoot)&&(a=a.querySelector("style"))&&(a.textContent=zf(b,c.A));c.A=e._styleAst}}
function Ig(a,b){return(b=of(b).getRootNode().host)?T(b)||Eg(b)?b:Ig(a,b):a.c}function Gg(a,b,c){var d=Ig(a,b),e=T(d),f=e.w;d===a.c||f||(Gg(a,d,e),f=e.w);a=Object.create(f||null);d=dg(b,c.A,c.cssBuild);b=bg(e.A,b).v;Object.assign(a,d.Ha,b,d.Ra);b=c.o;for(var g in b)if((e=b[g])||0===e)a[g]=e;g=ig;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e],a[d]=$f(g,a[d],a);c.w=a}n.styleDocument=function(a){this.styleSubtree(this.c,a)};
n.styleSubtree=function(a,b){var c=of(a),d=c.shadowRoot;(d||a===this.c)&&this.styleElement(a,b);if(a=d&&(d.children||d.childNodes))for(c=0;c<a.length;c++)this.styleSubtree(a[c]);else if(c=c.children||c.childNodes)for(a=0;a<c.length;a++)this.styleSubtree(c[a])};
n.ra=function(a){var b=this,c=rf(a);c!==this.f.cssBuild&&(this.f.cssBuild=c);if(!sf(c)){var d=ef(a);df(d,function(a){if(O)Rf(a);else{var d=R;a.selector=a.parsedSelector;Rf(a);a.selector=a.j=Cf(d,a,d.c,void 0,void 0)}Q&&""===c&&(Dg(b),b.a&&b.a.transformRule(a))});Q?a.textContent=cf(d):this.f.A.rules.push(d)}};n.getComputedStyleValue=function(a,b){var c;Q||(c=(T(a)||T(Ig(this,a))).w[b]);return(c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
n.Ua=function(a,b){var c=of(a).getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var d=a.getAttribute("class");if(d){d=d.split(/\s/);for(var e=0;e<d.length;e++)if(d[e]===R.a){c=d[e+1];break}}}c&&b.push(R.a,c);Q||(c=T(a))&&c.s&&b.push(ig.a,c.s);nf(a,b.join(" "))};n.Ba=function(a){return T(a)};n.Ta=function(a,b){wf(a,b)};n.Wa=function(a,b){wf(a,b,!0)};n.Sa=function(a){return qg(a)};n.Da=function(a){return pg(a)};Y.prototype.flush=Y.prototype.flush;Y.prototype.prepareTemplate=Y.prototype.prepareTemplate;
Y.prototype.styleElement=Y.prototype.styleElement;Y.prototype.styleDocument=Y.prototype.styleDocument;Y.prototype.styleSubtree=Y.prototype.styleSubtree;Y.prototype.getComputedStyleValue=Y.prototype.getComputedStyleValue;Y.prototype.setElementClass=Y.prototype.Ua;Y.prototype._styleInfoForNode=Y.prototype.Ba;Y.prototype.transformCustomStyleForDocument=Y.prototype.ra;Y.prototype.getStyleAst=Y.prototype.Fa;Y.prototype.styleAstToString=Y.prototype.Va;Y.prototype.flushCustomStyles=Y.prototype.flushCustomStyles;
Y.prototype.scopeNode=Y.prototype.Ta;Y.prototype.unscopeNode=Y.prototype.Wa;Y.prototype.scopeForNode=Y.prototype.Sa;Y.prototype.currentScopeForNode=Y.prototype.Da;Y.prototype.prepareAdoptedCssText=Y.prototype.Qa;Object.defineProperties(Y.prototype,{nativeShadow:{get:function(){return O}},nativeCss:{get:function(){return Q}}});var Z=new Y,Jg,Kg;window.ShadyCSS&&(Jg=window.ShadyCSS.ApplyShim,Kg=window.ShadyCSS.CustomStyleInterface);
window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c)},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b)},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c)},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b)},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a)},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a)},flushCustomStyles:function(){Z.flushCustomStyles()},
getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:Q,nativeShadow:O,cssBuild:Qe,disableRuntime:Pe};Jg&&(window.ShadyCSS.ApplyShim=Jg);Kg&&(window.ShadyCSS.CustomStyleInterface=Kg);var Lg=window.customElements,Mg=window.HTMLImports,Ng=window.HTMLTemplateElement;window.WebComponents=window.WebComponents||{};if(Lg&&Lg.polyfillWrapFlushCallback){var Og,Pg=function(){if(Og){Ng.C&&Ng.C(window.document);var a=Og;Og=null;a();return!0}},Qg=Mg.whenReady;Lg.polyfillWrapFlushCallback(function(a){Og=a;Qg(Pg)});Mg.whenReady=function(a){Qg(function(){Pg()?Mg.whenReady(a):a()})}}
Mg.whenReady(function(){requestAnimationFrame(function(){window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))})});var Rg=document.createElement("style");Rg.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var Sg=document.querySelector("head");Sg.insertBefore(Rg,Sg.firstChild);}).call(this);



},{}],"polyfills.ts":[function(require,module,exports) {
"use strict";

require("core-js/modules/web.timers");

require("core-js/modules/web.immediate");

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("@webcomponents/webcomponentsjs");
},{"core-js/modules/web.timers":"../../../../node_modules/core-js/modules/web.timers.js","core-js/modules/web.immediate":"../../../../node_modules/core-js/modules/web.immediate.js","core-js/modules/web.dom.iterable":"../../../../node_modules/core-js/modules/web.dom.iterable.js","@webcomponents/webcomponentsjs":"../../../../node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js"}],"../../../../../../../../../.nvm/versions/node/v10.16.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "34051" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../../.nvm/versions/node/v10.16.0/lib/node_modules/parcel/src/builtins/hmr-runtime.js","polyfills.ts"], null)
//# sourceMappingURL=/polyfills.94ad76bc.js.map