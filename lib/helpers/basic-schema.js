"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function MakeBasicSchema(config, bootstrap) {
    Object.keys(config.$resolvers).forEach(method_name => {
        const resolve = config.$resolvers[method_name];
        const fields = {};
        const args = {};
        Object.keys(resolve).forEach(key => {
            if (typeof resolve[key] === 'string') {
                fields[key] = { type: graphql_1.GraphQLString };
            }
            if (typeof resolve[key] === 'number') {
                fields[key] = { type: graphql_1.GraphQLInt };
            }
            if (typeof resolve[key] !== 'string' && resolve[key].length) {
                if (typeof resolve[key][0] === 'string') {
                    fields[key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
                }
                if (typeof resolve[key][0] === 'number') {
                    fields[key] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
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
