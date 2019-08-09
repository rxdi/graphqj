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
const fs_1 = require("fs");
const typescript_builder_1 = require("./typescript.builder");
const path_1 = require("path");
const js_yaml_1 = require("js-yaml");
function getConfig(configFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        let config;
        try {
            config = require('esm')(module)(path_1.join(process.cwd(), `${configFilename}.js`));
        }
        catch (e) { }
        if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.yml`)) {
            const file = fs_1.readFileSync(`./${configFilename}.yml`, { encoding: 'utf-8' });
            config = js_yaml_1.load(file);
            console.log(config);
        }
        if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.ts`)) {
            const isMigrateTempConfigExists = yield util_1.promisify(fs_1.exists)('./.gj/config.temp');
            const TranspileAndWriteTemp = (stats) => __awaiter(this, void 0, void 0, function* () {
                yield typescript_builder_1.TranspileTypescript([`/${configFilename}.ts`], './.gj');
                console.log('Transpile complete!');
                yield util_1.promisify(fs_1.writeFile)('./.gj/config.temp', stats.mtime.toISOString(), { encoding: 'utf-8' });
            });
            const stats = yield util_1.promisify(fs_1.stat)(`./${configFilename}.ts`);
            if (isMigrateTempConfigExists) {
                const temp = yield util_1.promisify(fs_1.readFile)('./.gj/config.temp', {
                    encoding: 'utf-8'
                });
                if (new Date(temp).toISOString() !== stats.mtime.toISOString()) {
                    console.log(`${configFilename} configuration is new transpiling...`);
                    yield TranspileAndWriteTemp(stats);
                }
            }
            else {
                console.log(`Transpile ${configFilename}.ts...`);
                yield TranspileAndWriteTemp(stats);
            }
            config = require(path_1.join(process.cwd(), `./.gj`, `${configFilename}.js`));
            try {
                yield util_1.promisify(fs_1.unlink)(path_1.join('./.gj', `${configFilename}.js.map`));
            }
            catch (e) { }
        }
        try {
            config = JSON.parse(yield util_1.promisify(fs_1.readFile)(path_1.join(process.cwd(), `${configFilename}.json`), {
                encoding: 'utf-8'
            }));
        }
        catch (e) { }
        return config;
    });
}
exports.getConfig = getConfig;
