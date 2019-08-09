"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@gapi/core");
const app_tokens_1 = require("../app/app.tokens");
const parse_ast_1 = require("./parse-ast");
const parse_args_schema_1 = require("./parse-args-schema");
const parse_types_schema_1 = require("./parse-types.schema");
function MakeAdvancedSchema(config, bootstrap) {
    const types = {};
    const Types = core_1.Container.get(app_tokens_1.TypesToken);
    const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
    const Resolvers = core_1.Container.get(app_tokens_1.TypesToken);
    Object.keys(config.$args).forEach(reusableArgumentKey => {
        const args = {};
        Object.keys(config.$args[reusableArgumentKey]).forEach(o => {
            const ck = config.$args[reusableArgumentKey][o];
            args[o] = parse_ast_1.ParseArgs(ck, args[o]);
            Arguments.set(reusableArgumentKey, args);
        });
    });
    Object.keys(config.$types).forEach(type => {
        if (types[type]) {
            return;
        }
        Object.keys(config.$types[type]).forEach(key => {
            types[type] = types[type] || {};
            types[type][key] = parse_types_schema_1.ParseTypesSchema(config.$types[type][key]);
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
