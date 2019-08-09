#!/usr/bin/env node
parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"helpers/args-extractors.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.includes=(e=>process.argv.toString().includes(e)),exports.nextOrDefault=((e,r=!0,s=(e=>e))=>{if(process.argv.toString().includes(e)){const t=process.argv[process.argv.indexOf(e)+1];return t?t.includes("--")?r:s(t):r}return r});
},{}],"helpers/typescript.builder.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("child_process");exports.TranspileTypescript=((r,s)=>new Promise((o,t)=>{const p=e.spawn("npx",["gapi","build","--glob",`${r.toString()}`,"--outDir",s]);p.stderr.pipe(process.stderr),p.on("close",e=>o(e))}));
},{}],"helpers/set-config.ts":[function(require,module,exports) {
"use strict";var i=this&&this.__awaiter||function(i,e,t,n){return new(t||(t=Promise))(function(o,r){function s(i){try{l(n.next(i))}catch(e){r(e)}}function c(i){try{l(n.throw(i))}catch(e){r(e)}}function l(i){i.done?o(i.value):new t(function(e){e(i.value)}).then(s,c)}l((n=n.apply(i,e||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const e=require("util"),t=require("fs"),n=require("./typescript.builder"),o=require("path"),r=require("js-yaml");function s(s){return i(this,void 0,void 0,function*(){let c;try{c=require("esm")(module)(o.join(process.cwd(),`${s}.js`))}catch(l){}if(yield e.promisify(t.exists)(`./${s}.yml`)){const i=t.readFileSync(`./${s}.yml`,{encoding:"utf-8"});c=r.load(i),console.log(c)}if(yield e.promisify(t.exists)(`./${s}.ts`)){const r=yield e.promisify(t.exists)("./.gj/config.temp"),u=o=>i(this,void 0,void 0,function*(){yield n.TranspileTypescript([`/${s}.ts`],"./.gj"),console.log("Transpile complete!"),yield e.promisify(t.writeFile)("./.gj/config.temp",o.mtime.toISOString(),{encoding:"utf-8"})}),y=yield e.promisify(t.stat)(`./${s}.ts`);if(r){const i=yield e.promisify(t.readFile)("./.gj/config.temp",{encoding:"utf-8"});new Date(i).toISOString()!==y.mtime.toISOString()&&(console.log(`${s} configuration is new transpiling...`),yield u(y))}else console.log(`Transpile ${s}.ts...`),yield u(y);c=require(o.join(process.cwd(),"./.gj",`${s}.js`));try{yield e.promisify(t.unlink)(o.join("./.gj",`${s}.js.map`))}catch(l){}}try{c=JSON.parse(yield e.promisify(t.readFile)(o.join(process.cwd(),`${s}.json`),{encoding:"utf-8"}))}catch(l){}return c})}exports.getConfig=s;
},{"./typescript.builder":"helpers/typescript.builder.ts"}],"helpers/basic.template.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.basicTemplate={$mode:"basic",$types:{user:{pesho:"string"}},$schema:"./schema.graphql",$resolvers:{findUser:{gosho:"omg",pesho:515151,pesho2:515151,pesho3:515151,dadadada:515151,pesho4:515151,pesho5:[515151],pesho6:["515151"]},findUser2:{gosho:"omg",pesho:22,pesho2:515151,pesho3:515151,pesho4:515151,pesho5:515151}}};
},{}],"helpers/advanced-schema.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("graphql");function t(t,r){const s={};Object.keys(t.$types).forEach(r=>{s[r]||(Object.keys(t.$types[r]).forEach(n=>{s[r]=s[r]||{},"string"===t.$types[r][n]&&(s[r][n]={type:e.GraphQLString}),"string[]"===t.$types[r][n]&&(s[r][n]={type:new e.GraphQLList(e.GraphQLString)}),"number"===t.$types[r][n]&&(s[r][n]={type:e.GraphQLInt}),"number[]"===t.$types[r][n]&&(s[r][n]={type:new e.GraphQLList(e.GraphQLInt)})}),s[r]=new e.GraphQLObjectType({name:r,fields:s[r]}))});const n=t=>{const r={};return t=t||r,Object.keys(t).forEach(s=>{"string"===t[s]&&(r[s]={type:e.GraphQLString}),"string[]"===t[s]&&(r[s]={type:new e.GraphQLList(e.GraphQLString)}),"string!"===t[s]&&(r[s]={type:new e.GraphQLNonNull(e.GraphQLString)}),"string[]!"===t[s]&&(r[s]={type:new e.GraphQLNonNull(new e.GraphQLList(e.GraphQLString))})}),r};Object.keys(t.$resolvers).forEach(e=>{const p=t.$resolvers[e].resolve,a=t.$resolvers[e].type;if(!s[a])throw new Error(`Missing type '${a}', Available types: '${Object.keys(s).toString()}'`);r.Fields.query[e]={type:s[a],method_name:e,args:n(t.$resolvers[e].args),public:!0,method_type:"query",target:()=>{},resolve:"function"==typeof p?p:()=>p}})}exports.MakeAdvancedSchema=t;
},{}],"helpers/basic-schema.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("graphql");function t(t,r){Object.keys(t.$resolvers).forEach(p=>{const s=t.$resolvers[p],n={};Object.keys(s).forEach(t=>{"string"==typeof s[t]&&(n[t]={type:e.GraphQLString}),"number"==typeof s[t]&&(n[t]={type:e.GraphQLInt}),"string"!=typeof s[t]&&s[t].length&&("string"==typeof s[t][0]&&(n[t]={type:new e.GraphQLList(e.GraphQLString)}),"number"==typeof s[t][0]&&(n[t]={type:new e.GraphQLList(e.GraphQLInt)}))}),r.Fields.query[p]={type:new e.GraphQLObjectType({name:`${p}_type`,fields:()=>n}),args:{},method_name:p,public:!0,method_type:"query",target:()=>{},resolve:"function"==typeof s?s:()=>s}})}exports.MakeBasicSchema=t;
},{}],"app/app.module.ts":[function(require,module,exports) {
"use strict";var e=this&&this.__decorate||function(e,r,t,c){var o,a=arguments.length,n=a<3?r:null===c?c=Object.getOwnPropertyDescriptor(r,t):c;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,r,t,c);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(n=(a<3?o(n):a>3?o(r,t,n):o(r,t))||n);return a>3&&n&&Object.defineProperty(r,t,n),n},r=this&&this.__awaiter||function(e,r,t,c){return new(t||(t=Promise))(function(o,a){function n(e){try{s(c.next(e))}catch(r){a(r)}}function i(e){try{s(c.throw(e))}catch(r){a(r)}}function s(e){e.done?o(e.value):new t(function(r){r(e.value)}).then(n,i)}s((c=c.apply(e,r||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const t=require("@gapi/core"),c=require("fs"),o=require("util"),a=require("../helpers/args-extractors"),n=require("@gapi/voyager"),i=require("../helpers/set-config"),s=require("../helpers/basic.template"),l=require("../helpers/advanced-schema"),u=require("../helpers/basic-schema"),h=require("path");let d=class{};d=e([t.Module({imports:[n.VoyagerModule.forRoot()],providers:[{provide:t.SCHEMA_OVERRIDE,useFactory:()=>e=>{let r;try{const e=JSON.parse(c.readFileSync(h.join(process.cwd(),"gj.json"),{encoding:"utf-8"}));e.$schema=e.$schema||a.nextOrDefault("--schema",!1),e.$schema&&(r=c.readFileSync(e.$schema,{encoding:"utf-8"}),r=t.buildSchema(r))}catch(i){}const n=t.mergeSchemas({schemas:[r,e].filter(e=>!!e)});return a.includes("--verbose")&&console.log(`\nSchema:\n${t.printSchema(n)}\n                  `),process.argv.toString().includes("--generate")?o.promisify(c.writeFile)("./schema.graphql",t.printSchema(n),{encoding:"utf-8"}).then(()=>{console.log("Schema created!"),process.exit(0)}):console.log("You can extract this schema by running --extract command"),n}},{provide:"createFields",deps:[t.BootstrapService],lazy:!0,useFactory:e=>r(this,void 0,void 0,function*(){let r=yield i.getConfig(a.nextOrDefault("--config","graphqj-config"));return r||(r=yield i.getConfig("gj")),r||(r=s.basicTemplate),"basic"===(r=r.default||r).$mode&&u.MakeBasicSchema(r,e),"advanced"===r.$mode&&l.MakeAdvancedSchema(r,e),!0})}]})],d),exports.AppModule=d;
},{"../helpers/args-extractors":"helpers/args-extractors.ts","../helpers/set-config":"helpers/set-config.ts","../helpers/basic.template":"helpers/basic.template.ts","../helpers/advanced-schema":"helpers/advanced-schema.ts","../helpers/basic-schema":"helpers/basic-schema.ts"}],"main.ts":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("@rxdi/core"),r=require("./app/app.module"),n=require("@gapi/core"),o=require("./helpers/args-extractors"),s=require("fs"),a=require("util");o.includes("init")?o.includes("advanced")?a.promisify(s.writeFile)("./gj.json",'\n{\n  "$mode": "advanced",\n  "$types": {\n    "user": {\n      "name": "string",\n      "email": "string",\n      "phone": "number",\n      "arrayOfNumbers": "number[]",\n      "arrayOfStrings": "string[]"\n    }\n  },\n  "$resolvers": {\n    "findUser": {\n      "type": "user",\n      "resolve": {\n        "name": "Kristiyan Tachev",\n        "email": "test@gmail.com",\n        "phone": 414141,\n        "arrayOfNumbers": [515151, 412414],\n        "arrayOfStrings": ["515151", "412414"]\n      }\n    }\n  }\n}',{encoding:"utf-8"}):a.promisify(s.writeFile)("./gj.json",'\n{\n  "$mode": "basic",\n  "$resolvers": {\n    "findUser": {\n      "name": "Kristiyan Tachev",\n      "email": "test@gmail.com",\n      "phone": 414141,\n      "arrayOfNumbers": [515151, 412414],\n      "arrayOfStrings": ["515151", "412414"]\n    }\n  }\n}\n',{encoding:"utf-8"}):e.BootstrapFramework(r.AppModule,[n.CoreModule.forRoot({graphql:{openBrowser:o.nextOrDefault("--random",!0,e=>"true"!==e)},server:{randomPort:o.nextOrDefault("--random",!1),hapi:{port:o.nextOrDefault("--port",9e3,e=>Number(e))}}})]).subscribe(()=>console.log("Started"),console.log.bind(console));
},{"./app/app.module":"app/app.module.ts","./helpers/args-extractors":"helpers/args-extractors.ts"}]},{},["main.ts"], null)
//# sourceMappingURL=/main.js.map