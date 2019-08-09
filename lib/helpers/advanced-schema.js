"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@gapi/core");
const app_tokens_1 = require("../app/app.tokens");
function MakeAdvancedSchema(config, bootstrap) {
    const types = {};
    const Types = core_1.Container.get(app_tokens_1.TypesToken);
    const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
    const Resolvers = core_1.Container.get(app_tokens_1.TypesToken);
    Object.keys(config.$types).forEach(type => {
        if (types[type]) {
            return;
        }
        Object.keys(config.$types[type]).forEach(key => {
            types[type] = types[type] || {};
            const ck = config.$types[type][key];
            if (ck === 'string' || ck === 'String') {
                types[type][key] = { type: graphql_1.GraphQLString };
            }
            if (ck === 'boolean' || ck === 'Boolean') {
                types[type][key] = { type: graphql_1.GraphQLString };
            }
            if (ck === 'number' || ck === 'Number') {
                types[type][key] = { type: graphql_1.GraphQLInt };
            }
            if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
            }
        });
        types[type] = new graphql_1.GraphQLObjectType({
            name: type,
            fields: types[type]
        });
    });
    const buildArgumentsSchema = (args) => {
        const fields = {};
        args = args || fields;
        Object.keys(args).forEach(a => {
            console.log(a, args[a]);
            const ck = args[a];
            /* Basic */
            if (ck === 'string' || ck === 'String') {
                fields[a] = { type: graphql_1.GraphQLString };
            }
            if (ck === 'boolean' || ck === 'Boolean' || ck === 'Bool') {
                fields[a] = { type: graphql_1.GraphQLBoolean };
            }
            if (ck === 'number' || ck === 'Number' || ck === 'Int') {
                fields[a] = { type: graphql_1.GraphQLInt };
            }
            /* False negative */
            if (ck === 'string!' || ck === 'String!') {
                fields[a] = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) };
            }
            if (ck === 'boolean!' || ck === 'Boolean!') {
                fields[a] = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) };
            }
            if (ck === 'number!' || ck === 'Number!' || ck === 'Int') {
                fields[a] = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) };
            }
            /* Array */
            if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (ck === 'boolean[]' ||
                ck === 'Boolean[]' ||
                ck === '[Boolean]' ||
                ck === '[Bool]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean) };
            }
            if (ck === 'number[]' ||
                ck === 'Number[]' ||
                ck === '[Number]' ||
                ck === '[Int]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
            }
            /* False negative Array */
            if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
                };
            }
            if (ck === 'boolean[]!' ||
                ck === 'Boolean[]!' ||
                ck === '[Boolean]!' ||
                ck === '[Bool]') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLBoolean))
                };
            }
            if (ck === 'number[]!' ||
                ck === 'Number[]!' ||
                ck === '[Number]!' ||
                ck === '[Int]!') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLInt))
                };
            }
        });
        return fields;
    };
    Object.keys(config.$resolvers).forEach(resolver => {
        console.log(resolver);
        const resolve = config.$resolvers[resolver].resolve;
        const type = config.$resolvers[resolver].type;
        if (!types[type]) {
            throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
        }
        bootstrap.Fields.query[resolver] = {
            type: types[type],
            method_name: resolver,
            args: buildArgumentsSchema(config.$resolvers[resolver].args),
            public: true,
            method_type: 'query',
            target: () => { },
            resolve: typeof resolve === 'function' ? resolve : () => resolve
        };
    });
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
