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
const is_array_1 = require("../is-array");
const traverse_array_1 = require("./traverse-array");
const traverse_object_1 = require("./traverse-object");
function traverseAndLoadConfigs(x) {
    return __awaiter(this, void 0, void 0, function* () {
        if (is_array_1.isArray(x)) {
            yield traverse_array_1.traverseArray(x);
        }
        else if (typeof x === 'object' && x !== null) {
            yield traverse_object_1.traverseObject(x);
        }
    });
}
exports.traverseAndLoadConfigs = traverseAndLoadConfigs;
