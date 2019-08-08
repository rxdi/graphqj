"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
                openBrowser: args_extractors_1.nextOrDefault('--random', true, (v) => v === 'true' ? false : true)
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
