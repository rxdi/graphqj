"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@gapi/core");
const app_tokens_1 = require("../app/app.tokens");
const parse_ast_1 = require("./parse-ast");
const parse_args_schema_1 = require("./parse-args-schema");
const parse_types_schema_1 = require("./parse-types.schema");
const isFunction_1 = require("./isFunction");
function getInjectorSymbols(symbols = [], directives) {
    return symbols
        .map(symbol => {
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
    })
        .filter(i => !!i);
}
function findInterceptor(symbol, method, externals) {
    const usedExternalModule = externals.find(s => s.map === symbol);
    if (!usedExternalModule.module[method]) {
        throw new Error(`Missing method ${method} inside ${usedExternalModule.file}`);
    }
    return usedExternalModule.module[method];
}
function getSymbolInjectionToken(symbol, method, externals) {
    const interceptor = findInterceptor(symbol, method, externals);
    return {
        token: new core_1.InjectionToken(core_1.createUniqueHash(`${interceptor}`)),
        interceptor
    };
}
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
    }
    else {
        const parts = directive[1].replace(rightBracket, '').split(symbolMap);
        for (var i = parts.length; i-- > 1;) {
            parts.splice(i, 0, symbolMap);
        }
        decorator = parts;
    }
    decorator = decorator.filter(i => !!i);
    const symbol = decorator[0];
    const methodToExecute = decorator[1].replace(/ +?/g, '');
    const { token, interceptor } = getSymbolInjectionToken(symbol, methodToExecute, externals);
    return {
        token,
        interceptor
    };
}
function MakeAdvancedSchema(config, bootstrap) {
    return __awaiter(this, void 0, void 0, function* () {
        const types = {};
        const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
        config.$args = config.$args || {};
        Object.keys(config.$args).forEach(reusableArgumentKey => {
            const args = {};
            Object.keys(config.$args[reusableArgumentKey]).forEach(o => {
                args[o] = parse_ast_1.ParseArgs(config.$args[reusableArgumentKey][o]);
                Arguments.set(reusableArgumentKey, args);
            });
        });
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
                    const [symbol] = config.$externals
                        .map(e => e.map)
                        .filter(s => resolver.includes(s));
                    if (symbol) {
                        const hasMultipleSymbols = [
                            ...new Set(resolver.split('=>').map(r => r.replace(/ +?/g, '').trim()))
                        ];
                        if (hasMultipleSymbols.length > 2) {
                            const directives = hasMultipleSymbols.slice(1, hasMultipleSymbols.length);
                            for (const injectorSymbol of getInjectorSymbols(config.$externals, directives)) {
                                core_1.Container.set(injectorSymbol.token, injectorSymbol.method);
                                interceptors.push(injectorSymbol.token);
                            }
                        }
                        else {
                            const { token, interceptor } = setPart(config.$externals, resolver, symbol);
                            core_1.Container.set(token, interceptor);
                            interceptors.push(token);
                        }
                        resolver = Object.keys(app_tokens_1.Roots)
                            .map(node => {
                            const types = Object.keys(app_tokens_1.Roots[node]).filter(key => resolver.includes(key));
                            if (types.length) {
                                return types[0];
                            }
                        })
                            .filter(i => !!i)[0];
                    }
                }
                types[type][key] = parse_types_schema_1.ParseTypesSchema(resolver, key, interceptors);
            });
            types[type] = new graphql_1.GraphQLObjectType({
                name: type,
                fields: types[type]
            });
        });
        Object.keys(config.$resolvers).forEach(resolver => {
            const type = config.$resolvers[resolver].type;
            let deps = config.$resolvers[resolver].deps || [];
            const mapDependencies = (dependencies) => dependencies
                .map(({ provide, map }) => ({
                container: core_1.Container.get(provide),
                provide,
                map
            }))
                .reduce((acc, curr) => (Object.assign({}, acc, { [curr.map]: curr.container })), {});
            if (!types[type]) {
                throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
            }
            let resolve = config.$resolvers[resolver].resolve;
            if (!isFunction_1.isFunction(resolve) && !Array.isArray(resolve)) {
                /* Take the first method inside file for resolver */
                let firstKey;
                for (var key in resolve) {
                    firstKey = key;
                    break;
                }
                if (!resolve[firstKey]) {
                    throw new Error(`Missing resolver for ${JSON.stringify(config.$resolvers[resolver])}`);
                }
                if (isFunction_1.isFunction(resolve[firstKey])) {
                    resolve = resolve[firstKey];
                }
            }
            resolve = isFunction_1.isFunction(resolve) ? resolve : () => resolve;
            bootstrap.Fields.query[resolver] = {
                type: types[type],
                method_name: resolver,
                args: parse_args_schema_1.buildArgumentsSchema(config, resolver),
                public: true,
                method_type: 'query',
                target: mapDependencies(deps),
                resolve
            };
        });
    });
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
