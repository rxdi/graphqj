"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@rxdi/core");
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.BooleanUnion = strEnum([
    'Boolean',
    'Bool',
    'boolean',
    'Boolean[]',
    'boolean[]',
    '[Boolean]',
    '[Bool]',
    'boolean!',
    'Boolean!',
    '[Boolean]!',
    'boolean[]!',
    'Boolean[]!'
]);
exports.StringUnion = strEnum([
    'String',
    'string',
    'String[]',
    'string[]',
    '[String]',
    'string!',
    'String!',
    'String[]!',
    'string[]!',
    '[String]!'
]);
exports.IntegerUnion = strEnum([
    'Int',
    'integer',
    'number',
    'Number',
    'Num',
    'int',
    'Number[]',
    'number[]',
    '[Number]',
    'number!',
    '[Int]',
    'Number!',
    'number[]!',
    'Number[]!',
    '[Number]!',
    '[Int]!'
]);
exports.Roots = {
    booleanNode: exports.BooleanUnion,
    stringNode: exports.StringUnion,
    numberNode: exports.IntegerUnion
};
exports.TypesToken = new core_1.InjectionToken('(@rxdi/graphqj): types-token');
exports.ArgumentsToken = new core_1.InjectionToken('(@rxdi/graphqj): arguments-token');
exports.ResolversToken = new core_1.InjectionToken('(@rxdi/graphqj): resolvers-token');
exports.GuardsToken = new core_1.InjectionToken('(@rxdi/graphqj): resolvers-token');
exports.Config = new core_1.InjectionToken();
