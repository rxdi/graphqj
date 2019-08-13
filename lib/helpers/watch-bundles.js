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
const core_1 = require("@gapi/core");
function watchBundles(paths, config) {
    const ignored = (p) => p.includes('node_modules');
    chokidar_1.watch([...new Set(paths)], { ignored }).on('change', (path) => __awaiter(this, void 0, void 0, function* () {
        const newModule = yield load_file_1.loadFile(path);
        yield traverse_1.traverseAndLoadConfigs(config);
        const schema = core_1.Container.get(core_1.BootstrapService).schema;
        schema.getQueryType().getFields()['findUser2'].resolve = newModule.findUser;
    }));
}
exports.watchBundles = watchBundles;
