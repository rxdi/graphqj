"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function MakeBasicSchema(config, bootstrap) {
    Object.keys(config.$resolvers).forEach(method_name => {
        const resolve = config.$resolvers[method_name];
        const fields = {};
        const args = {};
        Object.keys(resolve).forEach(key => {
            const resolver = resolve[key];
            if (typeof resolver === 'string') {
                fields[key] = { type: graphql_1.GraphQLString };
            }
            if (typeof resolver === 'number') {
                fields[key] = { type: graphql_1.GraphQLInt };
            }
            if (typeof resolver === 'boolean') {
                fields[key] = { type: graphql_1.GraphQLBoolean };
            }
            if (typeof resolver !== 'string' && resolver.length) {
                if (typeof resolver[0] === 'string') {
                    fields[key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
                }
                if (typeof resolver[0] === 'number') {
                    fields[key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
                }
                if (typeof resolver[0] === 'boolean') {
                    fields[key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean) };
                }
            }
        });
        bootstrap.Fields.query[method_name] = {
            type: new graphql_1.GraphQLObjectType({
                name: `${method_name}_type`,
                fields: () => fields
            }),
            args,
            method_name,
            public: true,
            method_type: 'query',
            target: () => { },
            resolve: typeof resolve === 'function' ? resolve : () => resolve
        };
    });
}
exports.MakeBasicSchema = MakeBasicSchema;
