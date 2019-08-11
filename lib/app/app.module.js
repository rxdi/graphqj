"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const app_tokens_1 = require("./app.tokens");
const transpile_and_load_1 = require("../helpers/transpile-and-load");
const traverse_1 = require("../helpers/traverse/traverse");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.Module({
        imports: [voyager_1.VoyagerModule.forRoot()],
        providers: [
            {
                provide: app_tokens_1.TypesToken,
                useValue: new Map()
            },
            {
                provide: app_tokens_1.ResolversToken,
                useValue: new Map()
            },
            {
                provide: app_tokens_1.ArgumentsToken,
                useValue: new Map()
            },
            {
                provide: app_tokens_1.GuardsToken,
                useValue: new Map()
            },
            {
                provide: core_1.SCHEMA_OVERRIDE,
                useFactory: () => (schema) => {
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
                    }
                    catch (e) { }
                    const schemas = [externalSchema, schema].filter(i => !!i);
                    let mergedSchemas;
                    if (schemas.length === 1) {
                        mergedSchemas = schema;
                    }
                    else {
                        mergedSchemas = core_1.mergeSchemas({
                            schemas
                        });
                    }
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
                    }
                    else {
                        console.log('You can extract this schema by running --generate command');
                    }
                    return mergedSchemas;
                }
            },
            {
                provide: app_tokens_1.Config,
                useFactory: () => __awaiter(this, void 0, void 0, function* () {
                    let config = yield set_config_1.getConfig(args_extractors_1.nextOrDefault('--config', 'graphqj-config'));
                    if (!config) {
                        config = yield set_config_1.getConfig('gj');
                    }
                    if (!config) {
                        config = basic_template_1.basicTemplate;
                    }
                    return config['default'] || config;
                })
            },
            {
                provide: 'Run',
                deps: [
                    app_tokens_1.Config,
                    core_1.BootstrapService,
                    app_tokens_1.TypesToken,
                    app_tokens_1.ResolversToken,
                    app_tokens_1.ArgumentsToken,
                    app_tokens_1.GuardsToken,
                    core_1.GRAPHQL_PLUGIN_CONFIG
                ],
                lazy: true,
                useFactory: (config, bootstrap, types, resolvers, args, guards, graphqlConfig) => __awaiter(this, void 0, void 0, function* () {
                    config = yield config;
                    yield traverse_1.traverseAndLoadConfigs(config);
                    if (config.$externals) {
                        const compiledPaths = yield transpile_and_load_1.TranspileAndGetAll(config.$externals, './.gj/out');
                        config.$externals = compiledPaths.map(external => {
                            if (external.file.includes('.ts')) {
                                external.module = require(external.transpiledFile);
                            }
                            else {
                                const m = require('esm')(module)(path_1.join(process.cwd(), external.file));
                                external.module = m['default'] || m;
                            }
                            core_1.Container.set(external.map, external.module);
                            return external;
                        });
                    }
                    let filePath = path_1.join(process.cwd(), config.$directives || '');
                    let directives;
                    if ((yield util_1.promisify(fs_1.exists)(filePath)) && filePath !== process.cwd()) {
                        if (filePath.includes('.ts')) {
                            directives = yield transpile_and_load_1.TranspileAndLoad(config.$directives.replace('.', ''), './.gj/out');
                        }
                        else {
                            directives = require('esm')(module)(filePath);
                        }
                        graphqlConfig.directives = (yield Promise.all(Object.keys(directives).map(d => typeof directives[d] === 'function' ? directives[d]() : null))).filter(i => !!i);
                    }
                    if (config.$mode === 'basic') {
                        yield basic_schema_1.MakeBasicSchema(config, bootstrap);
                    }
                    if (config.$mode === 'advanced') {
                        yield advanced_schema_1.MakeAdvancedSchema(config, bootstrap);
                    }
                    return true;
                })
            }
        ]
    })
], AppModule);
exports.AppModule = AppModule;
