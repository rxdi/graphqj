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
const core_1 = require("@rxdi/core");
const app_module_1 = require("./app/app.module");
const core_2 = require("@gapi/core");
const args_extractors_1 = require("./helpers/args-extractors");
const fs_1 = require("fs");
const util_1 = require("util");
const chokidar_1 = require("chokidar");
const self_child_1 = require("./helpers/self-child");
if (args_extractors_1.includes('--watch')) {
    let subscription;
    const configPath = process.argv.slice(2)[0];
    if (!fs_1.existsSync(configPath) && !configPath.includes('--')) {
        throw new Error(`File missing ${configPath}`);
    }
    const ignored = (p) => p.includes('node_modules');
    chokidar_1.watch(configPath, { ignored }).on('change', (event, path) => __awaiter(this, void 0, void 0, function* () {
        if (subscription) {
            subscription.unsubscribe();
        }
        subscription = self_child_1.SelfChild().subscribe(process => {
            console.log('Child process started: ', process.pid);
        });
    }));
    chokidar_1.watch(configPath, { ignored }).on('ready', (event, path) => __awaiter(this, void 0, void 0, function* () {
        if (subscription) {
            subscription.unsubscribe();
        }
        subscription = self_child_1.SelfChild().subscribe(process => {
            console.log('Child process started: ', process.pid);
        });
    }));
}
else if (args_extractors_1.includes('init')) {
    if (args_extractors_1.includes('advanced')) {
        util_1.promisify(fs_1.writeFile)('./gj.json', `
{
  "$mode": "advanced",
  "$types": {
    "user": {
      "name": "String",
      "email": "String",
      "phone": "Number",
      "arrayOfNumbers": "Number[]",
      "arrayOfStrings": "String[]"
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
}`, { encoding: 'utf-8' });
    }
    else {
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
`, { encoding: 'utf-8' });
    }
}
else {
    core_1.BootstrapFramework(app_module_1.AppModule, [
        core_2.CoreModule.forRoot({
            graphql: {
                openBrowser: args_extractors_1.nextOrDefault('--random', true, v => v === 'true' ? false : true)
            },
            server: {
                randomPort: args_extractors_1.nextOrDefault('--random', false),
                hapi: {
                    port: args_extractors_1.nextOrDefault('--port', 9000, p => Number(p))
                }
            }
        })
    ]).subscribe(() => console.log('Started'), console.log.bind(console));
}
