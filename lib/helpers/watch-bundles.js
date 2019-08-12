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
const chokidar_1 = require("chokidar");
const load_file_1 = require("./load-file");
const traverse_1 = require("./traverse/traverse");
function watchBundles(paths, config, bootstrap) {
    const ignored = (p) => p.includes('node_modules');
    chokidar_1.watch([...new Set(paths)], { ignored }).on('change', (path, stats) => __awaiter(this, void 0, void 0, function* () {
        const test = yield load_file_1.loadFile(path);
        console.log(test);
        yield traverse_1.traverseAndLoadConfigs(config);
        bootstrap.Fields.query['findUser'].resolve = function () {
        };
    }));
}
exports.watchBundles = watchBundles;
