"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function ParseTypesSchema(ck) {
    let key;
    if (ck === 'string' || ck === 'String') {
        key = { type: graphql_1.GraphQLString };
    }
    if (ck === 'boolean' || ck === 'Boolean') {
        key = { type: graphql_1.GraphQLString };
    }
    if (ck === 'number' || ck === 'Number') {
        key = { type: graphql_1.GraphQLInt };
    }
    if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
        key = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
    }
    if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
        key = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
    }
    if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
        key = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
    }
    return key;
}
exports.ParseTypesSchema = ParseTypesSchema;
