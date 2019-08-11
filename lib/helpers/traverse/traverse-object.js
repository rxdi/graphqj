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
const traverse_1 = require("./traverse");
const load_file_1 = require("../load-file");
const path_1 = require("path");
function traverseObject(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let [k, v] of Object.entries(obj)) {
            if (obj.hasOwnProperty(k)) {
                if (typeof obj[k] === 'string' && obj[k].includes('💉')) {
                    obj[k] = yield load_file_1.loadFile(path_1.join(process.cwd(), obj[k].replace('💉', '')));
                }
                yield traverse_1.traverseAndLoadConfigs(obj[k]);
            }
        }
    });
}
exports.traverseObject = traverseObject;
