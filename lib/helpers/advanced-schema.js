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
            if (config.$types[type][key] === 'string') {
                types[type][key] = { type: graphql_1.GraphQLString };
            }
            if (config.$types[type][key] === 'string[]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
            }
            if (config.$types[type][key] === 'number') {
                types[type][key] = { type: graphql_1.GraphQLInt };
            }
            if (config.$types[type][key] === 'number[]') {
                types[type][key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
            }
        });
        types[type] = new graphql_1.GraphQLObjectType({
            name: type,
            fields: types[type]
        });
    });
    Object.keys(config.$resolvers).forEach(method_name => {
        const resolve = config.$resolvers[method_name].resolve;
        const type = config.$resolvers[method_name].type;
        if (!types[type]) {
            throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
        }
        bootstrap.Fields.query[method_name] = {
            type: types[type],
            method_name,
            public: true,
            method_type: 'query',
            target: () => { },
            resolve: typeof resolve === 'function' ? resolve : () => resolve
        };
    });
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
