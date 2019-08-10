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
const util_1 = require("util");
const transpile_and_load_1 = require("./transpile-and-load");
const fs_1 = require("fs");
const js_yaml_1 = require("js-yaml");
const is_invalid_path_1 = require("./is-invalid-path");
function loadFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let m;
        if (is_invalid_path_1.isInValidPath(path)) {
            return path;
        }
        if (!(yield util_1.promisify(fs_1.exists)(path))) {
            throw new Error(`Missing external file for types ${path}`);
        }
        if (path.includes('.ts')) {
            m = yield transpile_and_load_1.TranspileAndLoad(path.replace('.', ''), './.gj/out');
        }
        else if (path.includes('.yml')) {
            m = js_yaml_1.load(yield util_1.promisify(fs_1.readFile)(path, { encoding: 'utf-8' }));
        }
        else if (path.includes('.json')) {
            m = require(path);
        }
        else if (path.includes('.html')) {
            m = yield util_1.promisify(fs_1.readFile)(path, { encoding: 'utf-8' });
        }
        else {
            m = require('esm')(module)(path);
        }
        return m;
    });
}
exports.loadFile = loadFile;
