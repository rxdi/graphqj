"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@gapi/core");
const app_tokens_1 = require("../app/app.tokens");
const parse_ast_1 = require("./parse-ast");
const parse_args_schema_1 = require("./parse-args-schema");
const parse_types_schema_1 = require("./parse-types.schema");
const path_1 = require("path");
function MakeAdvancedSchema(config, bootstrap) {
    const types = {};
    const Types = core_1.Container.get(app_tokens_1.TypesToken);
    const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
    const Resolvers = core_1.Container.get(app_tokens_1.TypesToken);
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
            const hasSymbol = config.$externals.filter(symbol => resolver.includes(symbol.map));
            const interceptors = [];
            if (hasSymbol.length) {
                const isCurlyPresent = resolver.includes('{');
                let stringLeft = '(';
                let stringRight = ')';
                if (isCurlyPresent) {
                    stringLeft = '{';
                    stringRight = '}';
                }
                const directive = resolver.split(stringLeft);
                const decorator = directive[1].replace(stringRight, '').split('@');
                const symbol = decorator[0];
                const methodToExecute = decorator[1].replace(/ +?/g, '');
                const usedExternalModule = config.$externals.find(s => s.map === symbol);
                let m;
                if (process.env.LAZY) {
                    m = require('esm')(module)(path_1.join(process.cwd(), usedExternalModule.file));
                }
                else {
                    m = usedExternalModule.module;
                }
                if (!m[methodToExecute]) {
                    throw new Error(`Missing method ${methodToExecute} inside ${usedExternalModule.file}`);
                }
                const containerSymbol = new core_1.InjectionToken(core_1.createUniqueHash(`${m[methodToExecute]}`));
                core_1.Container.set(containerSymbol, m[methodToExecute]);
                interceptors.push(containerSymbol);
                resolver = Object.keys(app_tokens_1.Roots)
                    .map(node => {
                    const types = Object.keys(app_tokens_1.Roots[node]).filter(key => resolver.includes(key));
                    if (types.length) {
                        return types[0];
                    }
                })
                    .filter(i => !!i)[0];
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
        if (!types[type]) {
            throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
        }
        const resolve = config.$resolvers[resolver].resolve;
        bootstrap.Fields.query[resolver] = {
            type: types[type],
            method_name: resolver,
            args: parse_args_schema_1.buildArgumentsSchema(config, resolver),
            public: true,
            method_type: 'query',
            target: () => { },
            resolve: typeof resolve === 'function' ? resolve : () => resolve
        };
    });
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
