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
})({"helpers/args-extractors.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.includes = i => process.argv.toString().includes(i);

exports.nextOrDefault = (i, fb = true, type = p => p) => {
  if (process.argv.toString().includes(i)) {
    const isNextArgumentPresent = process.argv[process.argv.indexOf(i) + 1];

    if (!isNextArgumentPresent) {
      return fb;
    }

    if (isNextArgumentPresent.includes('--')) {
      return fb;
    }

    return type(isNextArgumentPresent);
  }

  return fb;
};
},{}],"helpers/typescript.builder.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

exports.TranspileTypescript = (paths, outDir) => {
  return new Promise((resolve, reject) => {
    const child = child_process_1.spawn('npx', ['gapi', 'build', '--glob', `${paths.toString()}`, '--outDir', outDir]); // child.stdout.pipe(process.stdout);

    child.stderr.pipe(process.stderr);
    child.on('close', code => resolve(code));
  });
};
},{}],"helpers/set-config.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const util_1 = require("util");

const fs_1 = require("fs");

const typescript_builder_1 = require("./typescript.builder");

const path_1 = require("path");

const js_yaml_1 = require("js-yaml");

function getConfig(configFilename) {
  return __awaiter(this, void 0, void 0, function* () {
    let config;

    try {
      config = require('esm')(module)(path_1.join(process.cwd(), `${configFilename}.js`)); // console.log('JS Config', config)
    } catch (e) {}

    if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.yml`)) {
      const file = fs_1.readFileSync(`./${configFilename}.yml`, {
        encoding: 'utf-8'
      });
      config = js_yaml_1.load(file); // console.log('YML Config', config)
    }

    if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.ts`)) {
      // console.log('Typescript Config', config)
      const isMigrateTempConfigExists = yield util_1.promisify(fs_1.exists)('./.gj/config.temp');

      const TranspileAndWriteTemp = stats => __awaiter(this, void 0, void 0, function* () {
        yield typescript_builder_1.TranspileTypescript([`/${configFilename}.ts`], './.gj'); // console.log('Transpile complete!');

        yield util_1.promisify(fs_1.writeFile)('./.gj/config.temp', stats.mtime.toISOString(), {
          encoding: 'utf-8'
        });
      });

      const stats = yield util_1.promisify(fs_1.stat)(`./${configFilename}.ts`);

      if (isMigrateTempConfigExists) {
        const temp = yield util_1.promisify(fs_1.readFile)('./.gj/config.temp', {
          encoding: 'utf-8'
        });

        if (new Date(temp).toISOString() !== stats.mtime.toISOString()) {
          // console.log(`${configFilename} configuration is new transpiling...`);
          yield TranspileAndWriteTemp(stats);
        }
      } else {
        // console.log(`Transpile ${configFilename}.ts...`);
        yield TranspileAndWriteTemp(stats);
      }

      config = require(path_1.join(process.cwd(), `./.gj`, `${configFilename}.js`));

      try {
        yield util_1.promisify(fs_1.unlink)(path_1.join('./.gj', `${configFilename}.js.map`));
      } catch (e) {}
    }

    try {
      config = JSON.parse((yield util_1.promisify(fs_1.readFile)(path_1.join(process.cwd(), `${configFilename}.json`), {
        encoding: 'utf-8'
      }))); // console.log('Json Config', config)
    } catch (e) {}

    return config;
  });
}

exports.getConfig = getConfig;
},{"./typescript.builder":"helpers/typescript.builder.ts"}],"helpers/basic.template.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicTemplate = {
  $mode: 'basic',
  $types: {
    user: {
      pesho: 'string'
    }
  },
  $schema: './schema.graphql',
  $resolvers: {
    findUser: {
      gosho: 'omg',
      pesho: 515151,
      pesho2: 515151,
      pesho3: 515151,
      dadadada: 515151,
      pesho4: 515151,
      pesho5: [515151],
      pesho6: ['515151']
    },
    findUser2: {
      gosho: 'omg',
      pesho: 22,
      pesho2: 515151,
      pesho3: 515151,
      pesho4: 515151,
      pesho5: 515151
    }
  }
};
},{}],"app/app.tokens.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

function strEnum(o) {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

exports.BooleanUnion = strEnum(['Boolean', 'Bool', 'boolean', 'Boolean[]', 'boolean[]', '[Boolean]', '[Bool]', 'boolean!', 'Boolean!', '[Boolean]!', 'boolean[]!', 'Boolean[]!']);
exports.StringUnion = strEnum(['String', 'string', 'String[]', 'string[]', '[String]', 'string!', 'String!', 'String[]!', 'string[]!', '[String]!']);
exports.IntegerUnion = strEnum(['Int', 'integer', 'number', 'Number', 'Num', 'int', 'Number[]', 'number[]', '[Number]', 'number!', '[Int]', 'Number!', 'number[]!', 'Number[]!', '[Number]!', '[Int]!']);
exports.Roots = {
  booleanNode: exports.BooleanUnion,
  stringNode: exports.StringUnion,
  numberNode: exports.IntegerUnion
};
exports.TypesToken = new core_1.InjectionToken('(@rxdi/graphqj): types-token');
exports.ArgumentsToken = new core_1.InjectionToken('(@rxdi/graphqj): arguments-token');
exports.ResolversToken = new core_1.InjectionToken('(@rxdi/graphqj): resolvers-token');
exports.GuardsToken = new core_1.InjectionToken('(@rxdi/graphqj): resolvers-token');
exports.IsBundlerInstalled = new core_1.InjectionToken('(@rxdi/graphqj): is-bundler-installed');
exports.Config = new core_1.InjectionToken();
},{}],"helpers/parse-ast.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

function ParseArgs(ck) {
  let type;
  /* Basic */

  if (ck === 'string' || ck === 'String') {
    type = {
      type: graphql_1.GraphQLString
    };
  }

  if (ck === 'boolean' || ck === 'Boolean' || ck === 'Bool') {
    type = {
      type: graphql_1.GraphQLBoolean
    };
  }

  if (ck === 'number' || ck === 'Number' || ck === 'Int') {
    type = {
      type: graphql_1.GraphQLInt
    };
  }
  /* False negative */


  if (ck === 'string!' || ck === 'String!') {
    type = {
      type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
    };
  }

  if (ck === 'boolean!' || ck === 'Boolean!') {
    type = {
      type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
    };
  }

  if (ck === 'number!' || ck === 'Number!' || ck === 'Int') {
    type = {
      type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)
    };
  }
  /* Array */


  if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
    };
  }

  if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]' || ck === '[Bool]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean)
    };
  }

  if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]' || ck === '[Int]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
    };
  }
  /* False negative Array */


  if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
    type = {
      type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
    };
  }

  if (ck === 'boolean[]!' || ck === 'Boolean[]!' || ck === '[Boolean]!' || ck === '[Bool]') {
    type = {
      type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLBoolean))
    };
  }

  if (ck === 'number[]!' || ck === 'Number[]!' || ck === '[Number]!' || ck === '[Int]!') {
    type = {
      type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLInt))
    };
  }

  return type;
}

exports.ParseArgs = ParseArgs;
},{}],"helpers/dynamic-schema/mutators/build-arguments.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const app_tokens_1 = require("../../../app/app.tokens");

const parse_ast_1 = require("../../parse-ast");

const core_1 = require("@rxdi/core");

function buildArguments(config) {
  Object.keys(config.$args).forEach(reusableArgumentKey => {
    const args = {};
    Object.keys(config.$args[reusableArgumentKey]).forEach(o => {
      args[o] = parse_ast_1.ParseArgs(config.$args[reusableArgumentKey][o]);
      core_1.Container.get(app_tokens_1.TypesToken).set(reusableArgumentKey, args);
    });
  });
}

exports.buildArguments = buildArguments;
},{"../../../app/app.tokens":"app/app.tokens.ts","../../parse-ast":"helpers/parse-ast.ts"}],"helpers/lazy-types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazyTypes = new Map();
},{}],"helpers/parse-types.schema.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

const core_1 = require("@rxdi/core");

const rxjs_1 = require("rxjs");

const lazy_types_1 = require("./lazy-types");

function ParseTypesSchema(ck, key, parentType, interceptors, types) {
  let type;

  if (ck === 'string' || ck === 'String') {
    type = {
      type: graphql_1.GraphQLString
    };
  }

  if (ck === 'boolean' || ck === 'Boolean') {
    type = {
      type: graphql_1.GraphQLString
    };
  }

  if (ck === 'number' || ck === 'Number') {
    type = {
      type: graphql_1.GraphQLInt
    };
  }

  if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
    };
  }

  if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
    };
  }

  if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
    type = {
      type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
    };
  }

  const isRecursiveType = ck.replace('(', '').replace(')', '').replace('!', '').replace('[', '').replace(']', '');

  if (parentType === isRecursiveType) {
    lazy_types_1.lazyTypes.set(parentType, Object.assign({}, lazy_types_1.lazyTypes.get(parentType), {
      [key]: isRecursiveType
    }));
    type = {
      type: types[parentType]
    }; // хмм
  }

  if (!type) {
    throw new Error(`Wrong plugged type ${ck}`);
  }

  type['resolve'] = function (...args) {
    return __awaiter(this, void 0, void 0, function* () {
      let defaultValue = args[0][key];

      for (const interceptor of interceptors) {
        defaultValue = yield core_1.Container.get(interceptor)(rxjs_1.of(defaultValue), args[0], args[1], args[2], args[3]);

        if (rxjs_1.isObservable(defaultValue)) {
          defaultValue = yield defaultValue.toPromise();
        }
      }

      return defaultValue;
    });
  };

  return type;
}

exports.ParseTypesSchema = ParseTypesSchema;
},{"./lazy-types":"helpers/lazy-types.ts"}],"helpers/dynamic-schema/mutators/build-types.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const app_tokens_1 = require("../../../app/app.tokens");

const parse_types_schema_1 = require("../../parse-types.schema");

const core_1 = require("@rxdi/core");

const graphql_1 = require("graphql");

function setPart(externals, resolver, symbolMap) {
  const isCurlyPresent = resolver.includes('{');
  let leftBracket = '(';
  let rightBracket = ')';

  if (isCurlyPresent) {
    leftBracket = '{';
    rightBracket = '}';
  }

  const directive = resolver.split(leftBracket);
  let decorator;

  if (resolver.includes('@')) {
    decorator = directive[1].replace(rightBracket, '').split('@');
  } else {
    const parts = directive[1].replace(rightBracket, '').split(symbolMap);

    for (var i = parts.length; i-- > 1;) {
      parts.splice(i, 0, symbolMap);
    }

    decorator = parts;
  }

  decorator = decorator.filter(i => !!i);
  const symbol = decorator[0];
  const methodToExecute = decorator[1].replace(/ +?/g, '');
  const {
    token,
    interceptor
  } = getSymbolInjectionToken(symbol, methodToExecute, externals);
  return {
    token,
    interceptor
  };
}

function getSymbolInjectionToken(symbol, method, externals) {
  const interceptor = findInterceptor(symbol, method, externals);
  return {
    token: new core_1.InjectionToken(core_1.createUniqueHash(`${interceptor}`)),
    interceptor
  };
}

function getInjectorSymbols(symbols = [], directives) {
  return symbols.map(symbol => {
    const [isPresent] = directives.filter(d => d.includes(symbol.map));

    if (isPresent) {
      const injector = isPresent.replace(/[^\w\s]/gi, '').replace(/ +?/g, '');
      const method = symbol.module[injector];

      if (!method) {
        throw new Error(`Missing method ${injector} inside ${symbol.file}`);
      }

      return {
        symbol: symbol.map,
        token: new core_1.InjectionToken(core_1.createUniqueHash(`${method}`)),
        module: symbol.module,
        method,
        injector
      };
    }
  }).filter(i => !!i);
}

function findInterceptor(symbol, method, externals) {
  const usedExternalModule = externals.find(s => s.map === symbol);

  if (!usedExternalModule.module[method]) {
    throw new Error(`Missing method ${method} inside ${usedExternalModule.file}`);
  }

  return usedExternalModule.module[method];
}

function buildTypes(config, types, buildedSchema) {
  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }

    const currentType = config.$types[type];
    Object.keys(currentType).forEach(key => {
      types[type] = types[type] || {};
      let resolver = currentType[key];
      const interceptors = [];

      if (config.$externals) {
        const [symbol] = config.$externals.map(e => e.map).filter(s => resolver.includes(s));

        if (symbol) {
          const hasMultipleSymbols = [...new Set(resolver.split('=>').map(r => r.replace(/ +?/g, '').trim()))];

          if (hasMultipleSymbols.length > 2) {
            const directives = hasMultipleSymbols.slice(1, hasMultipleSymbols.length);

            for (const injectorSymbol of getInjectorSymbols(config.$externals, directives)) {
              core_1.Container.set(injectorSymbol.token, injectorSymbol.method);
              interceptors.push(injectorSymbol.token);
            }
          } else {
            const {
              token,
              interceptor
            } = setPart(config.$externals, resolver, symbol);
            core_1.Container.set(token, interceptor);
            interceptors.push(token);
          }

          resolver = Object.keys(app_tokens_1.Roots).map(node => {
            const types = Object.keys(app_tokens_1.Roots[node]).filter(key => resolver.includes(key));

            if (types.length) {
              return types[0];
            }
          }).filter(i => !!i)[0];
        }
      }

      types[type][key] = parse_types_schema_1.ParseTypesSchema(resolver, key, type, interceptors, types);
    });
    buildedSchema[type] = new graphql_1.GraphQLObjectType({
      name: type,
      fields: () => types[type]
    });
  });
}

exports.buildTypes = buildTypes;
},{"../../../app/app.tokens":"app/app.tokens.ts","../../parse-types.schema":"helpers/parse-types.schema.ts"}],"helpers/isFunction.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function isFunction(object) {
  return typeof object === 'function';
}

exports.isFunction = isFunction;
},{}],"helpers/get-first-item.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const isFunction_1 = require("./isFunction");
/**
 * Gets first item of the object without iterating all objects inside
 */


function getFirstItem(object) {
  if (!object) {
    return null;
  }

  let firstKey;

  for (var key in object) {
    firstKey = key;
    break;
  }

  if (!object[firstKey]) {
    throw new Error(`Missing method ${firstKey}`);
  }

  if (isFunction_1.isFunction(object[firstKey])) {
    object = object[firstKey];
  }

  return object;
}

exports.getFirstItem = getFirstItem;
},{"./isFunction":"helpers/isFunction.ts"}],"helpers/parse-args-schema.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

const core_1 = require("@rxdi/core");

const parse_ast_1 = require("./parse-ast");

const app_tokens_1 = require("../app/app.tokens");

const InputObjectTypes = new Map();

exports.buildArgumentsSchema = (config, resolver) => {
  let args = config.$resolvers[resolver].args || {};
  let fields = {};
  const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
  Object.keys(args).forEach(a => {
    const name = args[a].replace('!', '');

    if (Arguments.has(name)) {
      let reusableType = new graphql_1.GraphQLInputObjectType({
        name,
        fields: () => Arguments.get(name)
      });

      if (InputObjectTypes.has(name)) {
        reusableType = InputObjectTypes.get(name);
      }

      InputObjectTypes.set(name, reusableType);

      if (args[a].includes('!')) {
        fields = {
          payload: {
            type: new graphql_1.GraphQLNonNull(reusableType)
          }
        };
      } else {
        fields = {
          payload: {
            type: reusableType
          }
        };
      }

      return;
    }

    fields[a] = parse_ast_1.ParseArgs(args[a]);
  });
  return fields;
};
},{"./parse-ast":"helpers/parse-ast.ts","../app/app.tokens":"app/app.tokens.ts"}],"helpers/dynamic-schema/mutators/build-resolvers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const isFunction_1 = require("../../isFunction");

const lazy_types_1 = require("../../lazy-types");

const get_first_item_1 = require("../../get-first-item");

const parse_args_schema_1 = require("../../parse-args-schema");

const core_1 = require("@rxdi/core");

const core_2 = require("@gapi/core");

function buildResolvers(config, types, buildedSchema) {
  Object.keys(config.$resolvers).forEach(resolver => {
    const type = config.$resolvers[resolver].type;
    const method = (config.$resolvers[resolver].method || 'query').toLocaleLowerCase();
    let deps = config.$resolvers[resolver].deps || [];

    const mapDependencies = dependencies => dependencies.map(({
      provide,
      map
    }) => ({
      container: core_1.Container.get(provide),
      provide,
      map
    })).reduce((acc, curr) => Object.assign({}, acc, {
      [curr.map]: curr.container
    }), {});

    if (!buildedSchema[type]) {
      throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
    }

    let resolve = config.$resolvers[resolver].resolve;

    if (resolve && !isFunction_1.isFunction(resolve) && !Array.isArray(resolve)) {
      /* Take the first method inside file for resolver */
      resolve = get_first_item_1.getFirstItem(resolve);
    }

    const oldResolve = resolve;
    resolve = isFunction_1.isFunction(resolve) ? resolve : () => oldResolve;
    Array.from(lazy_types_1.lazyTypes.keys()).forEach(type => {
      Object.keys(lazy_types_1.lazyTypes.get(type)).forEach(k => {
        buildedSchema[type].getFields()[k].type = buildedSchema[type]; // types[type].getFields()[k].resolve = resolve;
      });
    });
    core_1.Container.get(core_2.BootstrapService).Fields[method][resolver] = {
      type: buildedSchema[type],
      method_name: resolver,
      args: parse_args_schema_1.buildArgumentsSchema(config, resolver),
      public: true,
      method_type: method,
      target: mapDependencies(deps),
      resolve
    };
  });
}

exports.buildResolvers = buildResolvers;
},{"../../isFunction":"helpers/isFunction.ts","../../lazy-types":"helpers/lazy-types.ts","../../get-first-item":"helpers/get-first-item.ts","../../parse-args-schema":"helpers/parse-args-schema.ts"}],"helpers/advanced-schema.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const build_arguments_1 = require("../helpers/dynamic-schema/mutators/build-arguments");

const build_types_1 = require("../helpers/dynamic-schema/mutators/build-types");

const build_resolvers_1 = require("../helpers/dynamic-schema/mutators/build-resolvers");

function MakeAdvancedSchema(config) {
  return __awaiter(this, void 0, void 0, function* () {
    const types = {};
    const buildedSchema = {};
    config.$args = config.$args || {};
    config.$types = config.$types || {};
    build_arguments_1.buildArguments(config);
    build_types_1.buildTypes(config, types, buildedSchema);
    build_resolvers_1.buildResolvers(config, types, buildedSchema);
    return buildedSchema;
  });
}

exports.MakeAdvancedSchema = MakeAdvancedSchema;
},{"../helpers/dynamic-schema/mutators/build-arguments":"helpers/dynamic-schema/mutators/build-arguments.ts","../helpers/dynamic-schema/mutators/build-types":"helpers/dynamic-schema/mutators/build-types.ts","../helpers/dynamic-schema/mutators/build-resolvers":"helpers/dynamic-schema/mutators/build-resolvers.ts"}],"helpers/basic-schema.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

const core_1 = require("@gapi/core");

function MakeBasicSchema(config) {
  Object.keys(config.$resolvers).forEach(method_name => {
    const resolve = config.$resolvers[method_name];
    const fields = {};
    const args = {};
    Object.keys(resolve).forEach(key => {
      const resolver = resolve[key];

      if (typeof resolver === 'string') {
        fields[key] = {
          type: graphql_1.GraphQLString
        };
      }

      if (typeof resolver === 'number') {
        fields[key] = {
          type: graphql_1.GraphQLInt
        };
      }

      if (typeof resolver === 'boolean') {
        fields[key] = {
          type: graphql_1.GraphQLBoolean
        };
      }

      if (typeof resolver !== 'string' && resolver.length) {
        if (typeof resolver[0] === 'string') {
          fields[key] = {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
          };
        }

        if (typeof resolver[0] === 'number') {
          fields[key] = {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
          };
        }

        if (typeof resolver[0] === 'boolean') {
          fields[key] = {
            type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean)
          };
        }
      }
    });
    core_1.Container.get(core_1.BootstrapService).Fields.query[method_name] = {
      type: new graphql_1.GraphQLObjectType({
        name: `${method_name}_type`,
        fields: () => fields
      }),
      args,
      method_name,
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    };
  });
}

exports.MakeBasicSchema = MakeBasicSchema;
},{}],"helpers/transpiler-cache.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transpilerCache = new Map();
},{}],"helpers/transpile-and-load.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const typescript_builder_1 = require("./typescript.builder");

const path_1 = require("path");

const transpiler_cache_1 = require("./transpiler-cache");

const clearModule = require('clear-module');

function TranspileAndLoad(path, outDir) {
  return __awaiter(this, void 0, void 0, function* () {
    path = convertToRelative(path);

    if (transpiler_cache_1.transpilerCache.has(path)) {
      return transpiler_cache_1.transpilerCache.get(path);
    }

    yield typescript_builder_1.TranspileTypescript([path], outDir);
    const transpiledPath = getTranspiledFilePath(path, outDir);
    clearModule(transpiledPath);

    const file = require(transpiledPath);

    transpiler_cache_1.transpilerCache.set(path, file);
    return file;
  });
}

exports.TranspileAndLoad = TranspileAndLoad;

function getTranspiledFilePath(path, outDir) {
  return path_1.join(process.cwd(), outDir, path_1.parse(path_1.join(process.cwd(), outDir, path)).base.replace('ts', 'js'));
}

function convertToRelative(path) {
  path = path[0] === '.' ? path.substr(1) : path;
  return path_1.isAbsolute(path) ? path = path.replace(process.cwd(), '') : path;
}

function TranspileAndGetAll(externals, outDir) {
  return __awaiter(this, void 0, void 0, function* () {
    // console.log('Before All');
    yield typescript_builder_1.TranspileTypescript(externals.map(external => external.file).map(path => convertToRelative(path)), outDir);
    return externals.map(path => Object.assign({}, path, {
      transpiledFile: path_1.join(process.cwd(), outDir, path_1.parse(path.file).base.replace('ts', 'js'))
    }));
  });
}

exports.TranspileAndGetAll = TranspileAndGetAll;
},{"./typescript.builder":"helpers/typescript.builder.ts","./transpiler-cache":"helpers/transpiler-cache.ts"}],"helpers/is-invalid-path.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const path_1 = require("path");

function isInValidPath(path, options = {}) {
  if (path === '' || typeof path !== 'string') return true; // https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#maxpath

  const MAX_PATH = options.extended ? 32767 : 260;

  if (typeof path !== 'string' || path.length > MAX_PATH - 12) {
    return true;
  }

  const rootPath = path_1.parse(path).root;
  if (rootPath) path = path.slice(rootPath.length); // https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#Naming_Conventions

  if (options.file) {
    return /[<>:"/\\|?*]/.test(path);
  }

  return /[<>:"|?*]/.test(path);
}

exports.isInValidPath = isInValidPath;
},{}],"helpers/traverse-map.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverseMap = [];
},{}],"helpers/load-yml.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const util_1 = require("util");

const js_yaml_1 = require("js-yaml");

const fs_1 = require("fs");

function loadYml(path) {
  return __awaiter(this, void 0, void 0, function* () {
    return js_yaml_1.load((yield util_1.promisify(fs_1.readFile)(path, {
      encoding: 'utf-8'
    })));
  });
}

exports.loadYml = loadYml;
},{}],"helpers/load-file.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const util_1 = require("util");

const transpile_and_load_1 = require("./transpile-and-load");

const fs_1 = require("fs");

const is_invalid_path_1 = require("./is-invalid-path");

const traverse_map_1 = require("./traverse-map");

const path_1 = require("path");

const load_yml_1 = require("./load-yml");

const app_tokens_1 = require("../app/app.tokens");

const clearModule = require("clear-module");

const core_1 = require("@rxdi/core");

function loadFile(path) {
  return __awaiter(this, void 0, void 0, function* () {
    let loadedModule;

    if (is_invalid_path_1.isInValidPath(path)) {
      return path;
    }

    if (!(yield util_1.promisify(fs_1.exists)(path))) {
      const lastElement = traverse_map_1.traverseMap[traverse_map_1.traverseMap.length - 1];

      if (lastElement) {
        path = path_1.join(process.cwd(), lastElement.parent, path.replace(process.cwd(), ''));
      }
    }

    if (path.includes('.yml')) {
      loadedModule = load_yml_1.loadYml(path);
    } else if (path.includes('.json')) {
      path = path_1.normalize(path_1.join(process.cwd(), path));
      clearModule(path);
      loadedModule = require(path);
    } else if (path.includes('.html')) {
      loadedModule = yield util_1.promisify(fs_1.readFile)(path, {
        encoding: 'utf-8'
      });
    } else if (core_1.Container.get(app_tokens_1.IsBundlerInstalled).gapi && path.includes('.ts') || path.includes('.js')) {
      loadedModule = yield transpile_and_load_1.TranspileAndLoad(path, './.gj/out');
    } else {
      loadedModule = require('esm')(module, {
        cache: false
      })(path);
    }

    const parent = path.substring(0, path.lastIndexOf('/')).replace(process.cwd(), '');
    traverse_map_1.traverseMap.push({
      parent,
      path
    });
    return loadedModule;
  });
}

exports.loadFile = loadFile;
},{"./transpile-and-load":"helpers/transpile-and-load.ts","./is-invalid-path":"helpers/is-invalid-path.ts","./traverse-map":"helpers/traverse-map.ts","./load-yml":"helpers/load-yml.ts","../app/app.tokens":"app/app.tokens.ts"}],"helpers/traverse/test.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const load_file_1 = require("../load-file");

const path_1 = require("path");

function replaceInjectSymbol(path) {
  return path.replace('💉', '');
}

exports.replaceInjectSymbol = replaceInjectSymbol;

function deep(value) {
  return __awaiter(this, void 0, void 0, function* () {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    if (Array.isArray(value)) {
      return deepArray(value);
    }

    return deepObject(value);
  });
}

exports.deep = deep;
exports.meta = new Map();

function deepObject(source) {
  return __awaiter(this, void 0, void 0, function* () {
    const result = {};
    let path;
    let meta = {};

    for (let [key, value] of Object.entries(source)) {
      if (typeof value === 'string' && value.includes('💉')) {
        path = `${replaceInjectSymbol(value)}`;
        const mod = yield load_file_1.loadFile(path_1.join(process.cwd(), path));
        result[key] = yield deep(mod);
        meta[key] = path;
        Object.defineProperty(result, `_meta`, {
          value: meta,
          enumerable: false,
          writable: true
        });
      } else {
        result[key] = yield deep(value);
      }
    }

    return result;
  });
}

exports.deepObject = deepObject;

function deepArray(collection) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield Promise.all(collection.map(value => __awaiter(this, void 0, void 0, function* () {
      return deep(value);
    })));
  });
}

exports.deepArray = deepArray;
},{"../load-file":"helpers/load-file.ts"}],"helpers/is-array.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

exports.isArray = isArray;
},{}],"helpers/traverse/traverse.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const is_array_1 = require("../is-array");

function traverse(x, find) {
  return __awaiter(this, void 0, void 0, function* () {
    if (is_array_1.isArray(x)) {
      yield traverseArray(x, find);
    } else if (typeof x === 'object' && x !== null) {
      yield traverseObject(x, find);
    }

    null;
  });
}

exports.traverse = traverse;

function traverseObject(obj, find) {
  return __awaiter(this, void 0, void 0, function* () {
    for (let [k, v] of Object.entries(obj)) {
      if (obj.hasOwnProperty(k)) {
        if (yield find(k, v)) {
          break;
        } else {
          yield traverse(obj[k], find);
        }
      }
    }
  });
}

exports.traverseObject = traverseObject;

function traverseArray(arr, find) {
  return __awaiter(this, void 0, void 0, function* () {
    for (const x of arr) {
      return yield traverse(x, find);
    }
  });
}

exports.traverseArray = traverseArray;
},{"../is-array":"helpers/is-array.ts"}],"helpers/react-to-changes.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const traverse_1 = require("./traverse/traverse");

const core_1 = require("@gapi/core");

const get_first_item_1 = require("./get-first-item");

const load_file_1 = require("./load-file");

const advanced_schema_1 = require("./advanced-schema");

const test_1 = require("./traverse/test");

const lazy_types_1 = require("./lazy-types");

const watch_bundles_1 = require("./watch-bundles");

const basic_schema_1 = require("./basic-schema");

const transpiler_cache_1 = require("./transpiler-cache");

function findMetaKey(path, meta) {
  return Object.keys(meta).find(k => meta[k] === path);
}

function getMetaPath(path) {
  return `.${path.replace(process.cwd(), '')}`;
}

let isRunning;

function reactToChanges(path, config) {
  return __awaiter(this, void 0, void 0, function* () {
    if (isRunning) {
      console.log(`✋  Bundle is updating previews change! Unable to update ${path}`);
      return;
    }

    const timer = Date.now();
    console.log(`💡  Bundle changed: ${path}`);
    isRunning = true;

    try {
      transpiler_cache_1.transpilerCache.delete(path.replace(process.cwd(), ''));
      transpiler_cache_1.transpilerCache.delete(path.replace(process.cwd(), '').replace('.', ''));
      const newFile = yield load_file_1.loadFile(path);

      if (watch_bundles_1.configWatchers.filter(p => path.includes(p)).length) {
        config = yield test_1.deep(newFile);
      } else if (config._meta) {
        // First level deepnest
        const metaKey = findMetaKey(getMetaPath(path), config._meta);

        if (metaKey) {
          config[metaKey] = yield test_1.deep(newFile);
        }
      } else {
        // Traverse recursive and find metadata for specific file and update it
        yield traverse_1.traverse(config, (k, v) => __awaiter(this, void 0, void 0, function* () {
          if (typeof v === 'object' && v._meta) {
            const foundMetaKey = findMetaKey(getMetaPath(path), v._meta);

            if (foundMetaKey) {
              v[foundMetaKey] = yield test_1.deep(get_first_item_1.getFirstItem(newFile));
              return true;
            }
          }

          return false;
        }));
      }

      lazy_types_1.lazyTypes.clear();
      core_1.Container.get(core_1.BootstrapService).Fields = {
        mutation: {},
        query: {},
        subscription: {}
      };

      if (config.$mode === 'basic') {
        yield basic_schema_1.MakeBasicSchema(config);
      }

      if (config.$mode === 'advanced') {
        yield advanced_schema_1.MakeAdvancedSchema(config);
      }

      core_1.Container.get(core_1.ApolloService).init();
      console.log(`📦  Bundle realoaded! ${Date.now() - timer}ms`, path);
      isRunning = false; // await SchemaIntrospection()
    } catch (e) {
      isRunning = false;
      console.error(e);
    }
  });
}

exports.reactToChanges = reactToChanges;
},{"./traverse/traverse":"helpers/traverse/traverse.ts","./get-first-item":"helpers/get-first-item.ts","./load-file":"helpers/load-file.ts","./advanced-schema":"helpers/advanced-schema.ts","./traverse/test":"helpers/traverse/test.ts","./lazy-types":"helpers/lazy-types.ts","./watch-bundles":"helpers/watch-bundles.ts","./basic-schema":"helpers/basic-schema.ts","./transpiler-cache":"helpers/transpiler-cache.ts"}],"helpers/watch-bundles.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const chokidar_1 = require("chokidar");

const react_to_changes_1 = require("./react-to-changes");

exports.configWatchers = ['gj.yml', 'gj.json', 'gj.js', 'gj.ts'];

function watchBundles(paths, config) {
  const ignored = p => p.includes('node_modules');

  chokidar_1.watch([...new Set(paths), ...exports.configWatchers.map(p => `./${p}`)], {
    ignored
  }).on('change', path => __awaiter(this, void 0, void 0, function* () {
    return react_to_changes_1.reactToChanges(path, config);
  }));
}

exports.watchBundles = watchBundles; // @Injectable()
// export class BundleWatcher {
//   private configWatchers = ['./gj.yml', './gj.json', './gj.js', './gj.ts'];
//   private ignored = (p: string) => p.includes('node_modules');
//   private watcher: FSWatcher;
//   constructor() {
//     this.watcher = watch([...this.configWatchers], {
//       ignored: this.ignored
//     })
//   }
//   unwatch(path: string[] | string) {
//     this.watcher.unwatch(path);
//   }
//   addBundles(paths: string[]) {
//     this.watcher.add(paths);
//   }
//   onChange(config: Config) {
//     this.watcher.on('change', async path => reactToChanges(path, config));
//   }
//   stop() {
//     this.watcher.close();
//   }
//   getWatcher() {
//     return this.watcher;
//   }
// }
},{"./react-to-changes":"helpers/react-to-changes.ts"}],"helpers/is-runner-installed.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const util_1 = require("util");

function run(cmd) {
  return __awaiter(this, void 0, void 0, function* () {
    let res;

    try {
      if ((yield util_1.promisify(child_process_1.exec)(cmd)).stderr) {
        res = false;
      } else {
        res = true;
      }
    } catch (e) {
      res = false;
    }

    return res;
  });
}

function isParcelInstalled() {
  return __awaiter(this, void 0, void 0, function* () {
    return yield run('parcel help');
  });
}

exports.isParcelInstalled = isParcelInstalled;

function isGapiInstalled() {
  return __awaiter(this, void 0, void 0, function* () {
    return yield run('gapi daemon status');
  });
}

exports.isGapiInstalled = isGapiInstalled;
},{}],"app/client/types/client-view.type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

exports.ClientViewType = new graphql_1.GraphQLObjectType({
  name: 'ClientViewType',
  fields: () => ({
    html: {
      type: graphql_1.GraphQLString
    },
    query: {
      type: graphql_1.GraphQLString
    },
    props: {
      type: graphql_1.GraphQLString
    },
    output: {
      type: graphql_1.GraphQLString
    }
  })
});
},{}],"app/client/types/client.type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

const client_view_type_1 = require("./client-view.type");

exports.ClientType = new graphql_1.GraphQLObjectType({
  name: 'ClientType',
  fields: {
    views: {
      type: new graphql_1.GraphQLList(client_view_type_1.ClientViewType)
    }
  }
});
},{"./client-view.type":"app/client/types/client-view.type.ts"}],"helpers/obj-to-array.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.objToArray = a => Object.keys(a).reduce((acc, curr) => [...acc, a[curr]], []);
},{}],"app/client/client.controller.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = this && this.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var _a, _b;

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@gapi/core");

const client_type_1 = require("./types/client.type");

const app_tokens_1 = require("../app.tokens");

const obj_to_array_1 = require("../../helpers/obj-to-array");

let ClientController = class ClientController {
  constructor(pubsub, config) {
    this.pubsub = pubsub;
    this.config = config;
    setInterval(() => this.OnInit(), 1000);
  }

  OnInit() {
    return __awaiter(this, void 0, void 0, function* () {
      const config = yield this.config;
      this.pubsub.publish('listenForChanges', config.$views);
    });
  }

  listenForChanges(views) {
    return {
      views: obj_to_array_1.objToArray(views)
    };
  }

};

__decorate([core_1.Type(client_type_1.ClientType), core_1.Subscribe(function () {
  return this.pubsub.asyncIterator('listenForChanges');
}), core_1.Subscription(), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], ClientController.prototype, "listenForChanges", null);

ClientController = __decorate([core_1.Controller({
  guards: [],
  type: []
}), __param(1, core_1.Inject(app_tokens_1.Config)), __metadata("design:paramtypes", [typeof (_a = typeof core_1.PubSubService !== "undefined" && core_1.PubSubService) === "function" ? _a : Object, typeof (_b = typeof app_tokens_1.Config !== "undefined" && app_tokens_1.Config) === "function" ? _b : Object])], ClientController);
exports.ClientController = ClientController;
},{"./types/client.type":"app/client/types/client.type.ts","../app.tokens":"app/app.tokens.ts","../../helpers/obj-to-array":"helpers/obj-to-array.ts"}],"app/client/client.module.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const client_controller_1 = require("./client.controller");

let ClientModule = class ClientModule {};
ClientModule = __decorate([core_1.Module({
  controllers: [client_controller_1.ClientController]
})], ClientModule);
exports.ClientModule = ClientModule;
},{"./client.controller":"app/client/client.controller.ts"}],"app/app.module.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs_1 = require("fs");

const util_1 = require("util");

const args_extractors_1 = require("../helpers/args-extractors");

const voyager_1 = require("@gapi/voyager");

const set_config_1 = require("../helpers/set-config");

const basic_template_1 = require("../helpers/basic.template");

const advanced_schema_1 = require("../helpers/advanced-schema");

const basic_schema_1 = require("../helpers/basic-schema");

const path_1 = require("path");

const test_1 = require("../helpers/traverse/test");

const traverse_map_1 = require("../helpers/traverse-map");

const watch_bundles_1 = require("../helpers/watch-bundles");

const is_runner_installed_1 = require("../helpers/is-runner-installed");

const client_module_1 = require("./client/client.module");

const core_1 = require("@gapi/core");

const app_tokens_1 = require("./app.tokens");

const transpile_and_load_1 = require("../helpers/transpile-and-load");

let AppModule = class AppModule {};
AppModule = __decorate([core_1.Module({
  imports: [voyager_1.VoyagerModule.forRoot(), client_module_1.ClientModule],
  providers: [{
    provide: app_tokens_1.TypesToken,
    useValue: new Map()
  }, {
    provide: app_tokens_1.IsBundlerInstalled,
    useValue: {
      parcel: false,
      gapi: false
    }
  }, {
    provide: core_1.SCHEMA_OVERRIDE,
    useFactory: () => schema => {
      let externalSchema;

      try {
        const config = JSON.parse(fs_1.readFileSync(path_1.join(process.cwd(), 'gj.json'), {
          encoding: 'utf-8'
        }));
        config.$schema = config.$schema || args_extractors_1.nextOrDefault('--schema', false);

        if (config.$schema) {
          externalSchema = fs_1.readFileSync(config.$schema, {
            encoding: 'utf-8'
          });
          externalSchema = core_1.buildSchema(externalSchema);
        }
      } catch (e) {}

      const schemas = [externalSchema, schema].filter(i => !!i);
      let mergedSchemas;

      if (schemas.length === 1) {
        mergedSchemas = schema;
      } else {
        mergedSchemas = core_1.mergeSchemas({
          schemas
        });
      }

      if (args_extractors_1.includes('--verbose')) {
        console.log(`
Schema:
${core_1.printSchema(mergedSchemas)}
                  `);
      }

      if (process.argv.toString().includes('--generate')) {
        util_1.promisify(fs_1.writeFile)('./schema.graphql', core_1.printSchema(mergedSchemas), {
          encoding: 'utf-8'
        }).then(() => {
          console.log('Schema created!');
          process.exit(0);
        });
      }

      return mergedSchemas;
    }
  }, {
    provide: app_tokens_1.Config,
    useFactory: () => __awaiter(this, void 0, void 0, function* () {
      let config = yield set_config_1.getConfig(args_extractors_1.nextOrDefault('--config', 'graphqj-config'));

      if (!config) {
        config = yield set_config_1.getConfig('gj');
      }

      if (!config) {
        config = basic_template_1.basicTemplate;
      }

      return config['default'] || config;
    })
  }, {
    provide: 'Run',
    deps: [app_tokens_1.Config, core_1.GRAPHQL_PLUGIN_CONFIG, app_tokens_1.IsBundlerInstalled],
    lazy: true,
    useFactory: (config, graphqlConfig, isBundlerInstalled) => __awaiter(this, void 0, void 0, function* () {
      config = yield config;
      config = yield test_1.deep(config);
      isBundlerInstalled.gapi = yield is_runner_installed_1.isGapiInstalled();

      if (config.$externals) {
        const compiledPaths = yield transpile_and_load_1.TranspileAndGetAll(config.$externals, './.gj/out');
        config.$externals = compiledPaths.map(external => {
          if (external.file.includes('.ts')) {
            external.module = require(external.transpiledFile);
          } else {
            const m = require('esm')(module)(path_1.join(process.cwd(), external.file));

            external.module = m['default'] || m;
          }

          core_1.Container.set(external.map, external.module);
          return external;
        });
      }

      let filePath = path_1.join(process.cwd(), config.$directives || '');
      let directives;

      if ((yield util_1.promisify(fs_1.exists)(filePath)) && filePath !== process.cwd()) {
        if (filePath.includes('.ts')) {
          directives = yield transpile_and_load_1.TranspileAndLoad(config.$directives.replace('.', ''), './.gj/out');
        } else {
          directives = require('esm')(module)(filePath);
        }

        graphqlConfig.directives = (yield Promise.all(Object.keys(directives).map(d => typeof directives[d] === 'function' ? directives[d]() : null))).filter(i => !!i);
      }

      if (config.$mode === 'basic') {
        yield basic_schema_1.MakeBasicSchema(config);
      }

      if (config.$mode === 'advanced') {
        yield advanced_schema_1.MakeAdvancedSchema(config);
      }

      if (args_extractors_1.includes('--hot-reload')) {
        config.$externals.forEach(e => traverse_map_1.traverseMap.push({
          parent: null,
          path: e.file
        }));
        watch_bundles_1.watchBundles(traverse_map_1.traverseMap.map(f => f.path), config);
      }

      console.log('You can extract this schema by running --generate command');
      return true;
    })
  }]
})], AppModule);
exports.AppModule = AppModule;
},{"../helpers/args-extractors":"helpers/args-extractors.ts","../helpers/set-config":"helpers/set-config.ts","../helpers/basic.template":"helpers/basic.template.ts","../helpers/advanced-schema":"helpers/advanced-schema.ts","../helpers/basic-schema":"helpers/basic-schema.ts","../helpers/traverse/test":"helpers/traverse/test.ts","../helpers/traverse-map":"helpers/traverse-map.ts","../helpers/watch-bundles":"helpers/watch-bundles.ts","../helpers/is-runner-installed":"helpers/is-runner-installed.ts","./client/client.module":"app/client/client.module.ts","./app.tokens":"app/app.tokens.ts","../helpers/transpile-and-load":"helpers/transpile-and-load.ts"}],"helpers/self-child.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const child_process_1 = require("child_process");

const rxjs_1 = require("rxjs");

exports.SelfChild = configFile => {
  return new rxjs_1.Observable(observer => {
    const args = [];
    args.push('--config');
    args.push(configFile);
    const child = child_process_1.spawn('gj', args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    process.on('exit', () => child.kill());
    observer.next(child);
    return () => {
      observer.complete();
      child.kill();
      console.log(`Child process: ${child.pid} killed`);
    };
  });
};
},{}],"main.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const app_module_1 = require("./app/app.module");

const core_2 = require("@gapi/core");

const args_extractors_1 = require("./helpers/args-extractors");

const fs_1 = require("fs");

const util_1 = require("util");

const chokidar_1 = require("chokidar");

const self_child_1 = require("./helpers/self-child");

if (args_extractors_1.includes('--watch')) {
  let subscription;
  const configPath = args_extractors_1.nextOrDefault('--config');

  if (!fs_1.existsSync(configPath)) {
    throw new Error(`File missing ${configPath}`);
  }

  const ignored = p => p.includes('node_modules');

  chokidar_1.watch(configPath, {
    ignored
  }).on('change', (event, path) => __awaiter(this, void 0, void 0, function* () {
    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = self_child_1.SelfChild(configPath).subscribe(process => {
      console.log('Child process started: ', process.pid);
    });
  }));
  chokidar_1.watch(configPath, {
    ignored
  }).on('ready', (event, path) => __awaiter(this, void 0, void 0, function* () {
    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = self_child_1.SelfChild(configPath).subscribe(process => {
      console.log('Child process started: ', process.pid);
    });
  }));
} else if (args_extractors_1.includes('init')) {
  if (args_extractors_1.includes('advanced')) {
    util_1.promisify(fs_1.writeFile)('./gj.json', `
{
  "$mode": "advanced",
  "$types": {
    "user": {
      "name": "String",
      "email": "String",
      "phone": "Number",
      "arrayOfNumbers": "Number[]",
      "arrayOfStrings": "String[]"
    }
  },
  "$resolvers": {
    "findUser": {
      "type": "user",
      "resolve": {
        "name": "Kristiyan Tachev",
        "email": "test@gmail.com",
        "phone": 414141,
        "arrayOfNumbers": [515151, 412414],
        "arrayOfStrings": ["515151", "412414"]
      }
    }
  }
}`, {
      encoding: 'utf-8'
    });
  } else if (args_extractors_1.includes('es6')) {
    util_1.promisify(fs_1.writeFile)('./gj.js', `
export default {
  $mode: 'advanced',
  $types: {
    user: {
      name: 'String',
      email: 'String',
      phone: 'Number',
      arrayOfNumbers: 'Number[]',
      arrayOfStrings: 'String[]'
    }
  },
  $resolvers: {
    findUser: {
      type: 'user',
      args: {
        userId: "String!",
        userId2: "String",
      },
      resolve: async (root, payload, context) => ({
        name: 'Kristiyan Tachev',
        email: 'test@gmail.com',
        phone: 4141423,
        arrayOfNumbers: [515151, 412414],
        arrayOfStrings: ['515151', '412414']
      })
    }
  }
};
`, {
      encoding: 'utf-8'
    });
  } else if (args_extractors_1.includes('typescript')) {
    util_1.promisify(fs_1.writeFile)('./gj.ts', `
export default {
  $mode: 'advanced',
  $types: {
    user: {
      name: 'String',
      email: 'String',
      phone: 'Number',
      arrayOfNumbers: 'Number[]',
      arrayOfStrings: 'String[]'
    }
  },
  $resolvers: {
    findUser: {
      type: 'user',
      args: {
        userId: "String!",
        userId2: "String",
      },
      resolve: async (root, payload: { userId: string; userId2?: string }) => ({
        name: 'Kristiyan Tachev',
        email: 'test@gmail.com',
        phone: 4141423,
        arrayOfNumbers: [515151, 412414],
        arrayOfStrings: ['515151', '412414']
      })
    }
  }
};
`, {
      encoding: 'utf-8'
    });
  } else if (args_extractors_1.includes('yml')) {
    util_1.promisify(fs_1.writeFile)('./gj.yml', `
$mode: advanced
$types:
  user:
    name: String
    email: String
    phone: Number
    arrayOfNumbers: Number[]
    arrayOfStrings: String[]

$resolvers:
  findUser:
    type: user
    args:
      userId: String
    resolve:
      name: Kristiyan Tachev
      email: test@gmail.com
      phone: 414141
      arrayOfNumbers: 
        - 515151
        - 412414
      arrayOfStrings:
        - '515151'
        - '412414'

  findUser2:
    type: user
    args:
      userId: String!
    resolve:
      name: Kristiyan Tachev
      email: test@gmail.com
      phone: 414141
      arrayOfNumbers: 
        - 515151
        - 412414
      arrayOfStrings:
        - '515151'
        - '412414'
`, {
      encoding: 'utf-8'
    });
  } else {
    util_1.promisify(fs_1.writeFile)('./gj.json', `
{
  "$mode": "basic",
  "$resolvers": {
    "findUser": {
      "name": "Kristiyan Tachev",
      "email": "test@gmail.com",
      "phone": 414141,
      "arrayOfNumbers": [515151, 412414],
      "arrayOfStrings": ["515151", "412414"]
    }
  }
}
`, {
      encoding: 'utf-8'
    });
  }
} else {
  core_1.BootstrapFramework(app_module_1.AppModule, [core_2.CoreModule.forRoot({
    graphql: {
      openBrowser: args_extractors_1.nextOrDefault('--random', true, v => v === 'true' ? false : true),
      buildAstDefinitions: false // Removed ast definition since directives are lost

    },
    server: {
      randomPort: args_extractors_1.nextOrDefault('--random', false),
      hapi: {
        port: args_extractors_1.nextOrDefault('--port', 9000, p => Number(p))
      }
    }
  })]).subscribe(() => console.log('Started'), console.log.bind(console));
}
},{"./app/app.module":"app/app.module.ts","./helpers/args-extractors":"helpers/args-extractors.ts","./helpers/self-child":"helpers/self-child.ts"}]},{},["main.ts"], null)
//# sourceMappingURL=/main.js.map