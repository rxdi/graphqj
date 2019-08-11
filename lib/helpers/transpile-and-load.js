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
const typescript_builder_1 = require("./typescript.builder");
const path_1 = require("path");
const transpiler_cache_1 = require("./transpiler-cache");
function TranspileAndLoad(path, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        path = convertToRelative(path);
        if (transpiler_cache_1.transpilerCache.has(path)) {
            return transpiler_cache_1.transpilerCache.get(path);
        }
        yield typescript_builder_1.TranspileTypescript([path], outDir);
        const file = require(getTranspiledFilePath(path, outDir));
        transpiler_cache_1.transpilerCache.set(path, file);
        return file;
    });
}
exports.TranspileAndLoad = TranspileAndLoad;
function getTranspiledFilePath(path, outDir) {
    return path_1.join(process.cwd(), outDir, path_1.parse(path_1.join(process.cwd(), outDir, path)).base.replace('ts', 'js'));
}
function convertToRelative(path) {
    path = path[0] === '.' ? path.substr(1) : path;
    return path_1.isAbsolute(path) ? (path = path.replace(process.cwd(), '')) : path;
}
function TranspileAndGetAll(externals, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield typescript_builder_1.TranspileTypescript(externals
            .map(external => external.file)
            .map(path => convertToRelative(path)), outDir);
        return externals.map(path => (Object.assign({}, path, { transpiledFile: path_1.join(process.cwd(), outDir, path_1.parse(path.file).base.replace('ts', 'js')) })));
    });
}
exports.TranspileAndGetAll = TranspileAndGetAll;
