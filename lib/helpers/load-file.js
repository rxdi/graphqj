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
const traverse_map_1 = require("./traverse-map");
const path_1 = require("path");
function loadFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let loadedModule;
        if (is_invalid_path_1.isInValidPath(path)) {
            return path;
        }
        if (!(yield util_1.promisify(fs_1.exists)(path))) {
            const lastElement = traverse_map_1.traverseMap[traverse_map_1.traverseMap.length - 1];
            if (lastElement) {
                path = path_1.join(process.cwd(), lastElement.parent, path.replace(process.cwd(), ''));
            }
        }
        if (path.includes('.ts')) {
            loadedModule = yield transpile_and_load_1.TranspileAndLoad(path, './.gj/out');
        }
        else if (path.includes('.yml')) {
            loadedModule = js_yaml_1.load(yield util_1.promisify(fs_1.readFile)(path, { encoding: 'utf-8' }));
        }
        else if (path.includes('.json')) {
            loadedModule = require(path);
        }
        else if (path.includes('.html')) {
            loadedModule = yield util_1.promisify(fs_1.readFile)(path, { encoding: 'utf-8' });
        }
        else {
            loadedModule = require('esm')(module)(path);
        }
        const parent = path
            .substring(0, path.lastIndexOf('/'))
            .replace(process.cwd(), '');
        traverse_map_1.traverseMap.push({ parent, path });
        return loadedModule;
    });
}
exports.loadFile = loadFile;
