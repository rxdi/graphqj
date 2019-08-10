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
function TranspileAndLoad(path, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield typescript_builder_1.TranspileTypescript([path], outDir);
        return require(path_1.join(process.cwd(), outDir, path_1.parse(path_1.join(process.cwd(), outDir, path)).base.replace('ts', 'js')));
    });
}
exports.TranspileAndLoad = TranspileAndLoad;
function TranspileAndGetAll(paths, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield typescript_builder_1.TranspileTypescript(paths.map(external => external.file).map(f => f.replace('.', '')), outDir);
        return paths.map(path => (Object.assign({}, path, { transpiledFile: path_1.join(process.cwd(), outDir, path_1.parse(path.file).base.replace('ts', 'js')) })));
    });
}
exports.TranspileAndGetAll = TranspileAndGetAll;
