"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
const BooleanUnion = strEnum([
    'Boolean',
    'Bool',
    'boolean'
]);
const StringUnion = strEnum([
    'String',
    'string'
]);
const IntegerUnion = strEnum([
    'Int',
    'integer',
    'number',
    'Num',
    'int'
]);
const Roots = {
    booleanNode: BooleanUnion,
    stringNode: StringUnion,
    numberNode: IntegerUnion
};
function MakeAdvancedSchema(config, bootstrap) {
    const types = {};
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
            if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]' || ck === '[Bool]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean) };
            }
            if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]' || ck === '[Int]') {
                fields[a] = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
            }
            /* False negative Array */
            if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
                };
            }
            if (ck === 'boolean[]!' || ck === 'Boolean[]!' || ck === '[Boolean]!' || ck === '[Bool]') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLBoolean))
                };
            }
            if (ck === 'number[]!' || ck === 'Number[]!' || ck === '[Number]!' || ck === '[Int]!') {
                fields[a] = {
                    type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLInt))
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
