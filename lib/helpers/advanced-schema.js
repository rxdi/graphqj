"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function MakeAdvancedSchema(config, bootstrap) {
    const types = {};
    Object.keys(config.$types).forEach(type => {
        if (types[type]) {
            return;
        }
        Object.keys(config.$types[type]).forEach(key => {
            types[type] = types[type] || {};
            const currentKey = config.$types[type][key];
            if (currentKey === 'string' || currentKey === 'String') {
                types[type][key] = { type: graphql_1.GraphQLString };
            }
            if (currentKey === 'string[]' || currentKey === 'String[]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (currentKey === 'number' || currentKey === 'Number') {
                types[type][key] = { type: graphql_1.GraphQLInt };
            }
            if (currentKey === 'number[]' || currentKey === 'Number[]') {
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
            const currentArg = args[a];
            if (currentArg === 'string' || currentArg === 'String') {
                fields[a] = { type: graphql_1.GraphQLString };
            }
            if (currentArg === 'string[]' || currentArg === 'String[]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (currentArg === 'string!' || currentArg === 'String!') {
                fields[a] = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) };
            }
            if (currentArg === 'string[]!' || currentArg === 'String[]!') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
                };
            }
        });
        return fields;
    };
    Object.keys(config.$resolvers).forEach(method_name => {
        const resolve = config.$resolvers[method_name].resolve;
        const type = config.$resolvers[method_name].type;
        if (!types[type]) {
            throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
        }
        bootstrap.Fields.query[method_name] = {
            type: types[type],
            method_name,
            args: buildArgumentsSchema(config.$resolvers[method_name].args),
            public: true,
            method_type: 'query',
            target: () => { },
            resolve: typeof resolve === 'function' ? resolve : () => resolve
        };
    });
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
