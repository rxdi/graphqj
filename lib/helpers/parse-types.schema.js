"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const core_1 = require("@rxdi/core");
const rxjs_1 = require("rxjs");
function ParseTypesSchema(ck, key, interceptors) {
    let type;
    if (ck === 'string' || ck === 'String') {
        type = { type: graphql_1.GraphQLString };
    }
    if (ck === 'boolean' || ck === 'Boolean') {
        type = { type: graphql_1.GraphQLString };
    }
    if (ck === 'number' || ck === 'Number') {
        type = { type: graphql_1.GraphQLInt };
    }
    if (ck === 'string[]' || ck === 'String[]' || ck === '[String]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
    }
    if (ck === 'boolean[]' || ck === 'Boolean[]' || ck === '[Boolean]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) };
    }
    if (ck === 'number[]' || ck === 'Number[]' || ck === '[Number]') {
        type = { type: new graphql_1.GraphQLList(graphql_1.GraphQLInt) };
    }
    type['resolve'] = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let defaultValue = args[0][key];
            for (const interceptor of interceptors) {
                defaultValue = yield core_1.Container.get(interceptor)(rxjs_1.of(defaultValue), args[1], args[2], args[3]);
                if (rxjs_1.isObservable(defaultValue)) {
                    defaultValue = yield defaultValue.toPromise();
                }
            }
            return defaultValue;
        });
    };
    return type;
}
exports.ParseTypesSchema = ParseTypesSchema;
