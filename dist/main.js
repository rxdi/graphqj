#!/usr/bin/env node
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
// Save the require from previous bundle to this closure if any
var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
var nodeRequire = typeof require === 'function' && require;
function newRequire(name, jumped) {
if (!cache[name]) {
if (!modules[name]) {
// if we cannot find the module within our internal map or
// cache jump to the current global require ie. the last bundle
// that was added to the page.
var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
if (!jumped && currentRequire) {
return currentRequire(name, true);
}
// If there are other bundles on this page the require from the
// previous one is saved to 'previousRequire'. Repeat this as
// many times as there are bundles until the module is found or
// we exhaust the require chain.
if (previousRequire) {
return previousRequire(name, true);
}
// Try the node require function if it exists.
if (nodeRequire && typeof name === 'string') {
return nodeRequire(name);
}
var err = new Error('Cannot find module \'' + name + '\'');
err.code = 'MODULE_NOT_FOUND';
throw err;
}
localRequire.resolve = resolve;
localRequire.cache = {};
var module = cache[name] = new newRequire.Module(name);
modules[name][0].call(module.exports, localRequire, module, module.exports, this);
}
return cache[name].exports;
function localRequire(x){
return newRequire(localRequire.resolve(x));
}
function resolve(x){
return modules[name][1][x] || x;
}
}
function Module(moduleName) {
this.id = moduleName;
this.bundle = newRequire;
this.exports = {};
}
newRequire.isParcelRequire = true;
newRequire.Module = Module;
newRequire.modules = modules;
newRequire.cache = cache;
newRequire.parent = previousRequire;
newRequire.register = function (id, exports) {
modules[id] = [function (require, module) {
module.exports = exports;
}, {}];
};
var error;
for (var i = 0; i < entry.length; i++) {
try {
newRequire(entry[i]);
} catch (e) {
// Save first error but execute all entries
if (!error) {
error = e;
}
}
}
if (entry.length) {
// Expose entry point to Node, AMD or browser globals
// Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
var mainExports = newRequire(entry[entry.length - 1]);
// CommonJS
if (typeof exports === "object" && typeof module !== "undefined") {
module.exports = mainExports;
// RequireJS
} else if (typeof define === "function" && define.amd) {
define(function () {
return mainExports;
});
// <script>
} else if (globalName) {
this[globalName] = mainExports;
}
}
// Override the current require with this new one
parcelRequire = newRequire;
if (error) {
// throw error from earlier, _after updating parcelRequire_
throw error;
}
return newRequire;
})({"helpers/args-extractors.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.includes = i => process.argv.toString().includes(i);
exports.nextOrDefault = (i, fb = true, type = p => p) => {
if (process.argv.toString().includes(i)) {
const isNextArgumentPresent = process.argv[process.argv.indexOf(i) + 1];
if (!isNextArgumentPresent) {
return fb;
}
if (isNextArgumentPresent.includes('--')) {
return fb;
}
return type(isNextArgumentPresent);
}
return fb;
};
},{}],"helpers/typescript.builder.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
const child_process_1 = require("child_process");
exports.TranspileTypescript = (paths, outDir) => {
return new Promise((resolve, reject) => {
const child = child_process_1.spawn('npx', ['gapi', 'build', '--glob', `${paths.toString()}`, '--outDir', outDir]); // child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);
child.on('close', code => resolve(code));
});
};
},{}],"helpers/set-config.ts":[function(require,module,exports) {
"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) {
try {
step(generator.next(value));
} catch (e) {
reject(e);
}
}
function rejected(value) {
try {
step(generator["throw"](value));
} catch (e) {
reject(e);
}
}
function step(result) {
result.done ? resolve(result.value) : new P(function (resolve) {
resolve(result.value);
}).then(fulfilled, rejected);
}
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", {
value: true
});
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
} catch (e) {}
if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.yml`)) {
const file = fs_1.readFileSync(`./${configFilename}.yml`, {
encoding: 'utf-8'
});
config = js_yaml_1.load(file);
console.log(config);
}
if (yield util_1.promisify(fs_1.exists)(`./${configFilename}.ts`)) {
const isMigrateTempConfigExists = yield util_1.promisify(fs_1.exists)('./.gj/config.temp');
const TranspileAndWriteTemp = stats => __awaiter(this, void 0, void 0, function* () {
yield typescript_builder_1.TranspileTypescript([`/${configFilename}.ts`], './.gj');
console.log('Transpile complete!');
yield util_1.promisify(fs_1.writeFile)('./.gj/config.temp', stats.mtime.toISOString(), {
encoding: 'utf-8'
});
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
} else {
console.log(`Transpile ${configFilename}.ts...`);
yield TranspileAndWriteTemp(stats);
}
config = require(path_1.join(process.cwd(), `./.gj`, `${configFilename}.js`));
try {
yield util_1.promisify(fs_1.unlink)(path_1.join('./.gj', `${configFilename}.js.map`));
} catch (e) {}
}
try {
config = JSON.parse((yield util_1.promisify(fs_1.readFile)(path_1.join(process.cwd(), `${configFilename}.json`), {
encoding: 'utf-8'
})));
} catch (e) {}
return config;
});
}
exports.getConfig = getConfig;
},{"./typescript.builder":"helpers/typescript.builder.ts"}],"helpers/basic.template.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.basicTemplate = {
$mode: 'basic',
$types: {
user: {
pesho: 'string'
}
},
$schema: './schema.graphql',
$resolvers: {
findUser: {
gosho: 'omg',
pesho: 515151,
pesho2: 515151,
pesho3: 515151,
dadadada: 515151,
pesho4: 515151,
pesho5: [515151],
pesho6: ['515151']
},
findUser2: {
gosho: 'omg',
pesho: 22,
pesho2: 515151,
pesho3: 515151,
pesho4: 515151,
pesho5: 515151
}
}
};
},{}],"helpers/advanced-schema.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
const graphql_1 = require("graphql");
function MakeAdvancedSchema(config, bootstrap) {
const types = {};
Object.keys(config.$types).forEach(type => {
if (types[type]) {
return;
}
Object.keys(config.$types[type]).forEach(key => {
types[type] = types[type] || {};
const currentKey = config.$types[type][key];
if (currentKey === 'string' || currentKey === 'String') {
types[type][key] = {
type: graphql_1.GraphQLString
};
}
if (currentKey === 'string[]' || currentKey === 'String[]') {
types[type][key] = {
type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
};
}
if (currentKey === 'number' || currentKey === 'Number') {
types[type][key] = {
type: graphql_1.GraphQLInt
};
}
if (currentKey === 'number[]' || currentKey === 'Number[]') {
types[type][key] = {
type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
};
}
});
types[type] = new graphql_1.GraphQLObjectType({
name: type,
fields: types[type]
});
});
const buildArgumentsSchema = args => {
const fields = {};
args = args || fields;
Object.keys(args).forEach(a => {
const currentArg = args[a];
if (currentArg === 'string' || currentArg === 'String') {
fields[a] = {
type: graphql_1.GraphQLString
};
}
if (currentArg === 'string[]' || currentArg === 'String[]') {
fields[a] = {
type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
};
}
if (currentArg === 'string!' || currentArg === 'String!') {
fields[a] = {
type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
};
}
if (currentArg === 'string[]!' || currentArg === 'String[]!') {
fields[a] = {
type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(graphql_1.GraphQLString))
};
}
});
return fields;
};
Object.keys(config.$resolvers).forEach(method_name => {
const resolve = config.$resolvers[method_name].resolve;
const type = config.$resolvers[method_name].type;
if (!types[type]) {
throw new Error(`Missing type '${type}', Available types: '${Object.keys(types).toString()}'`);
}
bootstrap.Fields.query[method_name] = {
type: types[type],
method_name,
args: buildArgumentsSchema(config.$resolvers[method_name].args),
public: true,
method_type: 'query',
target: () => {},
resolve: typeof resolve === 'function' ? resolve : () => resolve
};
});
}
exports.MakeAdvancedSchema = MakeAdvancedSchema;
},{}],"helpers/basic-schema.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
const graphql_1 = require("graphql");
function MakeBasicSchema(config, bootstrap) {
Object.keys(config.$resolvers).forEach(method_name => {
const resolve = config.$resolvers[method_name];
const fields = {};
const args = {};
Object.keys(resolve).forEach(key => {
const resolver = resolve[key];
if (typeof resolver === 'string') {
fields[key] = {
type: graphql_1.GraphQLString
};
}
if (typeof resolver === 'number') {
fields[key] = {
type: graphql_1.GraphQLInt
};
}
if (typeof resolver !== 'string' && resolver.length) {
if (typeof resolver[0] === 'string') {
fields[key] = {
type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
};
}
if (typeof resolver[0] === 'number') {
fields[key] = {
type: new graphql_1.GraphQLList(graphql_1.GraphQLInt)
};
}
}
});
bootstrap.Fields.query[method_name] = {
type: new graphql_1.GraphQLObjectType({
name: `${method_name}_type`,
fields: () => fields
}),
args,
method_name,
public: true,
method_type: 'query',
target: () => {},
resolve: typeof resolve === 'function' ? resolve : () => resolve
};
});
}
exports.MakeBasicSchema = MakeBasicSchema;
},{}],"app/app.module.ts":[function(require,module,exports) {
"use strict";
var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
var c = arguments.length,
r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
d;
if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) {
try {
step(generator.next(value));
} catch (e) {
reject(e);
}
}
function rejected(value) {
try {
step(generator["throw"](value));
} catch (e) {
reject(e);
}
}
function step(result) {
result.done ? resolve(result.value) : new P(function (resolve) {
resolve(result.value);
}).then(fulfilled, rejected);
}
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
Object.defineProperty(exports, "__esModule", {
value: true
});
const core_1 = require("@gapi/core");
const fs_1 = require("fs");
const util_1 = require("util");
const args_extractors_1 = require("../helpers/args-extractors");
const voyager_1 = require("@gapi/voyager");
const set_config_1 = require("../helpers/set-config");
const basic_template_1 = require("../helpers/basic.template");
const advanced_schema_1 = require("../helpers/advanced-schema");
const basic_schema_1 = require("../helpers/basic-schema");
const path_1 = require("path");
let AppModule = class AppModule {};
AppModule = __decorate([core_1.Module({
imports: [voyager_1.VoyagerModule.forRoot()],
providers: [{
provide: core_1.SCHEMA_OVERRIDE,
useFactory: () => schema => {
let externalSchema;
try {
const config = JSON.parse(fs_1.readFileSync(path_1.join(process.cwd(), 'gj.json'), {
encoding: 'utf-8'
}));
config.$schema = config.$schema || args_extractors_1.nextOrDefault('--schema', false);
if (config.$schema) {
externalSchema = fs_1.readFileSync(config.$schema, {
encoding: 'utf-8'
});
externalSchema = core_1.buildSchema(externalSchema);
}
} catch (e) {}
const mergedSchemas = core_1.mergeSchemas({
schemas: [externalSchema, schema].filter(i => !!i)
});
if (args_extractors_1.includes('--verbose')) {
console.log(`
Schema:
${core_1.printSchema(mergedSchemas)}
`);
}
if (process.argv.toString().includes('--generate')) {
util_1.promisify(fs_1.writeFile)('./schema.graphql', core_1.printSchema(mergedSchemas), {
encoding: 'utf-8'
}).then(() => {
console.log('Schema created!');
process.exit(0);
});
} else {
console.log('You can extract this schema by running --extract command');
}
return mergedSchemas;
}
}, {
provide: 'createFields',
deps: [core_1.BootstrapService],
lazy: true,
useFactory: bootstrap => __awaiter(this, void 0, void 0, function* () {
let config = yield set_config_1.getConfig(args_extractors_1.nextOrDefault('--config', 'graphqj-config'));
if (!config) {
config = yield set_config_1.getConfig('gj');
}
if (!config) {
config = basic_template_1.basicTemplate;
}
config = config['default'] || config;
if (config.$mode === 'basic') {
basic_schema_1.MakeBasicSchema(config, bootstrap);
}
if (config.$mode === 'advanced') {
advanced_schema_1.MakeAdvancedSchema(config, bootstrap);
}
return true;
})
}]
})], AppModule);
exports.AppModule = AppModule;
},{"../helpers/args-extractors":"helpers/args-extractors.ts","../helpers/set-config":"helpers/set-config.ts","../helpers/basic.template":"helpers/basic.template.ts","../helpers/advanced-schema":"helpers/advanced-schema.ts","../helpers/basic-schema":"helpers/basic-schema.ts"}],"main.ts":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
const core_1 = require("@rxdi/core");
const app_module_1 = require("./app/app.module");
const core_2 = require("@gapi/core");
const args_extractors_1 = require("./helpers/args-extractors");
const fs_1 = require("fs");
const util_1 = require("util");
if (args_extractors_1.includes('init')) {
if (args_extractors_1.includes('advanced')) {
util_1.promisify(fs_1.writeFile)('./gj.json', `
{
"$mode": "advanced",
"$types": {
"user": {
"name": "string",
"email": "string",
"phone": "number",
"arrayOfNumbers": "number[]",
"arrayOfStrings": "string[]"
}
},
"$resolvers": {
"findUser": {
"type": "user",
"resolve": {
"name": "Kristiyan Tachev",
"email": "test@gmail.com",
"phone": 414141,
"arrayOfNumbers": [515151, 412414],
"arrayOfStrings": ["515151", "412414"]
}
}
}
}`, {
encoding: 'utf-8'
});
} else {
util_1.promisify(fs_1.writeFile)('./gj.json', `
{
"$mode": "basic",
"$resolvers": {
"findUser": {
"name": "Kristiyan Tachev",
"email": "test@gmail.com",
"phone": 414141,
"arrayOfNumbers": [515151, 412414],
"arrayOfStrings": ["515151", "412414"]
}
}
}
`, {
encoding: 'utf-8'
});
}
} else {
core_1.BootstrapFramework(app_module_1.AppModule, [core_2.CoreModule.forRoot({
graphql: {
openBrowser: args_extractors_1.nextOrDefault('--random', true, v => v === 'true' ? false : true)
},
server: {
randomPort: args_extractors_1.nextOrDefault('--random', false),
hapi: {
port: args_extractors_1.nextOrDefault('--port', 9000, p => Number(p))
}
}
})]).subscribe(() => console.log('Started'), console.log.bind(console));
}
},{"./app/app.module":"app/app.module.ts","./helpers/args-extractors":"helpers/args-extractors.ts"}]},{},["main.ts"], null)
//# sourceMappingURL=/main.js.map