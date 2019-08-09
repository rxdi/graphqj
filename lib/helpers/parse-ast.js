"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function ParseArgs(ck) {
    let type;
    /* Basic */
    if (ck === 'string' || ck === 'String') {
        type = { type: graphql_1.GraphQLString };
    }
    if (ck === 'boolean' || ck === 'Boolean' || ck === 'Bool') {
        type = { type: graphql_1.GraphQLBoolean };
    }
    if (ck === 'number' || ck === 'Number' || ck === 'Int') {
        type = { type: graphql_1.GraphQLInt };
    }
    /* False negative */
    if (ck === 'string!' || ck === 'String!') {
        type = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) };
    }
    if (ck === 'boolean!' || ck === 'Boolean!') {
        type = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) };
    }
    if (ck === 'number!' || ck === 'Number!' || ck === 'Int') {
        type = { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) };
    }
    /* Array */
    if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
    }
    if (ck === 'boolean[]' ||
        ck === 'Boolean[]' ||
        ck === '[Boolean]' ||
        ck === '[Bool]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLBoolean) };
    }
    if (ck === 'number[]' ||
        ck === 'Number[]' ||
        ck === '[Number]' ||
        ck === '[Int]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
    }
    /* False negative Array */
    if (ck === 'string[]!' || ck === 'String[]!' || ck === '[String]!') {
        type = {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
        };
    }
    if (ck === 'boolean[]!' ||
        ck === 'Boolean[]!' ||
        ck === '[Boolean]!' ||
        ck === '[Bool]') {
        type = {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLBoolean))
        };
    }
    if (ck === 'number[]!' ||
        ck === 'Number[]!' ||
        ck === '[Number]!' ||
        ck === '[Int]!') {
        type = {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLInt))
        };
    }
    return type;
}
exports.ParseArgs = ParseArgs;
