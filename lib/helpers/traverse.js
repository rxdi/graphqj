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
const load_yml_1 = require("./load-yml");
const path_1 = require("path");
function traverseAndLoadConfigs(x) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isArray(x)) {
            yield traverseArray(x);
        }
        else if (typeof x === 'object' && x !== null) {
            yield traverseObject(x);
        }
    });
}
exports.traverseAndLoadConfigs = traverseAndLoadConfigs;
function traverseArray(arr) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const x of arr) {
            yield traverseAndLoadConfigs(x);
        }
    });
}
function traverseObject(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let [k, v] of Object.entries(obj)) {
            if (obj.hasOwnProperty(k)) {
                if (typeof obj[k] === 'string' && obj[k].includes('💉')) {
                    obj[k] = yield load_yml_1.loadFile(path_1.join(process.cwd(), obj[k].replace('💉', '')));
                }
                yield traverseAndLoadConfigs(obj[k]);
            }
        }
    });
}
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
function* recursiveIterator(obj) {
    yield obj;
    for (const child of obj.children) {
        yield* recursiveIterator(child);
    }
}
exports.recursiveIterator = recursiveIterator;
