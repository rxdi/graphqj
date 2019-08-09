"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@rxdi/core");
const parse_ast_1 = require("./parse-ast");
const app_tokens_1 = require("../app/app.tokens");
const InputObjectTypes = new Map();
exports.buildArgumentsSchema = (config, resolver) => {
    let args = config.$resolvers[resolver].args || {};
    let fields = {};
    const Arguments = core_1.Container.get(app_tokens_1.TypesToken);
    Object.keys(args).forEach(a => {
        const name = args[a].replace('!', '');
        if (Arguments.has(name)) {
            let reusableType = new graphql_1.GraphQLInputObjectType({
                name,
                fields: () => Arguments.get(name)
            });
            if (InputObjectTypes.has(name)) {
                reusableType = InputObjectTypes.get(name);
            }
            InputObjectTypes.set(name, reusableType);
            if (args[a].includes('!')) {
                fields = {
                    payload: {
                        type: new graphql_1.GraphQLNonNull(reusableType)
                    }
                };
            }
            else {
                fields = {
                    payload: {
                        type: reusableType
                    }
                };
            }
            return;
        }
        fields[a] = parse_ast_1.ParseArgs(args[a]);
    });
    return fields;
};
