import { BootstrapFramework, Container, setup } from '@rxdi/core';
import { AppModule } from './app/app.module';
import { CoreModule } from '@gapi/core';
import { nextOrDefault, includes } from './helpers/args-extractors';
import { writeFile, existsSync } from 'fs';
import { promisify } from 'util';
import { watch } from 'chokidar';
import { SelfChild } from './helpers/self-child';
import { Subscription } from 'rxjs';
import { Config, Externals } from './app/app.tokens';
import { switchMap } from 'rxjs/operators';
import { TranspileAndLoad, TranspileAndGetAll } from './helpers/transpile-and-load';
import { getFirstItem } from './helpers/get-first-item';
import { loadFile } from './helpers/load-file';
import { getConfig } from './helpers/set-config';
import { transpileComponentsInit } from './helpers/component.parser';
import { IComponentsType } from './app/@introspection';

if (includes('--watch')) {
  let subscription: Subscription;
  const configPath = nextOrDefault('--config');
  if (!existsSync(configPath)) {
    throw new Error(`File missing ${configPath}`);
  }
  const ignored = (p: string) => p.includes('node_modules');

  watch(configPath, { ignored }).on('change', async (event, path) => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = SelfChild(configPath).subscribe(process => {
      console.log('Child process started: ', process.pid);
    });
  });

  watch(configPath, { ignored }).on('ready', async (event, path) => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = SelfChild(configPath).subscribe(process => {
      console.log('Child process started: ', process.pid);
    });
  });
} else if (includes('init')) {
  if (includes('advanced')) {
    promisify(writeFile)(
      './gj.json',
      `
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
}`,
      { encoding: 'utf-8' },
    );
  } else if (includes('es6')) {
    promisify(writeFile)(
      './gj.js',
      `
export default {
  $mode: 'advanced',
  $types: {
    user: {
      name: 'String',
      email: 'String',
      phone: 'Number',
      arrayOfNumbers: 'Number[]',
      arrayOfStrings: 'String[]'
    }
  },
  $resolvers: {
    findUser: {
      type: 'user',
      args: {
        userId: "String!",
        userId2: "String",
      },
      resolve: async (root, payload, context) => ({
        name: 'Kristiyan Tachev',
        email: 'test@gmail.com',
        phone: 4141423,
        arrayOfNumbers: [515151, 412414],
        arrayOfStrings: ['515151', '412414']
      })
    }
  }
};
`,
      { encoding: 'utf-8' },
    );
  } else if (includes('typescript')) {
    promisify(writeFile)(
      './gj.ts',
      `
export default {
  $mode: 'advanced',
  $types: {
    user: {
      name: 'String',
      email: 'String',
      phone: 'Number',
      arrayOfNumbers: 'Number[]',
      arrayOfStrings: 'String[]'
    }
  },
  $resolvers: {
    findUser: {
      type: 'user',
      args: {
        userId: "String!",
        userId2: "String",
      },
      resolve: async (root, payload: { userId: string; userId2?: string }) => ({
        name: 'Kristiyan Tachev',
        email: 'test@gmail.com',
        phone: 4141423,
        arrayOfNumbers: [515151, 412414],
        arrayOfStrings: ['515151', '412414']
      })
    }
  }
};
`,
      { encoding: 'utf-8' },
    );
  } else if (includes('yml')) {
    promisify(writeFile)(
      './gj.yml',
      `
$mode: advanced
$types:
  User:
    name: String
    email: String
    phone: Number
    arrayOfNumbers: Number[]
    arrayOfStrings: String[]
    arrayOfStrings2: String[]
    users: User[]
$args:
  UserPayload:
    name: String!
    pesho: String

$resolvers:
  findUser:
    type: User
    args:
      userId: UserPayload
    resolve: !!js/function >
      function foobar(root, payload, context, info) {
        console.log('OMG')
        return {
          "name": "Kristiyan Tachev",
          "email": "test@gmail.com",
          "phone": 414141,
          "arrayOfNumbers": [515151, 412414],
          "arrayOfStrings": ['515151', '412414']
        }
      }

$views:

  app:
    html: |
      <style>
        .spacer {
          flex: 1 3 auto;
        }
        .container {
          display: flex;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #f3f3f3;
          cursor: pointer;
        }
        li {
          float: left;
        }
        li a {
          display: block;
          color: #666;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
        }
        li a:hover:not(.active) {
          background-color: #ddd;
        }
        li a.active {
          color: white;
          background-color: #4caf50;
        }
        .footer {
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100%;
          background-color: #03a9f4;
          color: white;
          text-align: center;
        }
      </style>
      <ul class="container" slot="header">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contacts">Contacts</a></li>
        <span class="spacer"></span>
      </ul>
      <div class="footer" slot="footer">
        <p>Footer</p>
      </div>

  home:
    query: |
      query findUser {
        findUser {
          name
          email
          phone
          arrayOfStrings
        }
      }
    output: UserPayload
    policy: network-only
    html: |
      Welcome to Home component
      <p>Name: {findUser.name}</p>
      <p>Email: {findUser.email}</p>
      <p>Phone: {findUser.phone}</p>
      {findUser.arrayOfStrings}
      <div style="background-color: red">
        <hamburger-component type="3dx" active=true enableBackendStatistics=${true}></hamburger-component>
      </div>

  about:
    query: findUser
    html: |
      Welcome to About
      <p>Name: {findUser.name}</p>
      <p>Email: {findUser.email}</p>
      <p>Phone: {findUser.phone}</p>

  contacts:
    html: |
      Welcome to Contacts

  not-found:
    html: |
      Not found
`,
      { encoding: 'utf-8' },
    );
  } else {
    promisify(writeFile)(
      './gj.json',
      `
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
`,
      { encoding: 'utf-8' },
    );
  }
} else {
  async function main() {
    Container.set('pubsub-auth', {
      onSubConnection(connectionParams) {
        return connectionParams;
      },
      onSubOperation(connectionParams, params, webSocket) {
        connectionParams;
        return params;
      },
    });
    let file: Config;
    try {
      file = await getConfig('gj');
    } catch (e) {}
    const imports = [];
    if (file && file.$imports) {
      const transpiledModules = await TranspileAndGetAll(
        file.$imports.map(file => ({ file: file.replace('💉', '') } as Externals)),
        'imports',
      );
      imports.push(...transpiledModules.map(f => getFirstItem(require(f.transpiledFile))));
    }
    if (file && file.$components) {
      await transpileComponentsInit(file.$components as IComponentsType[]);
    }

    BootstrapFramework(AppModule, [
      ...imports,
      CoreModule.forRoot({
        graphql: {
          openBrowser: nextOrDefault('--random', true, v => (v === 'true' ? false : true)),
          buildAstDefinitions: false, // Removed ast definition since directives are lost,
          graphiQlPath: '/graphiql',
          graphiqlOptions: {
            endpointURL: '/graphiql',
          },
        },
        pubsub: {
          authentication: 'pubsub-auth',
        },
        server: {
          randomPort: nextOrDefault('--random', false),
          hapi: {
            port: nextOrDefault('--port', 9000, p => Number(p)),
            routes: {
              cors: {
                origin: ['*'],
                additionalHeaders: [
                  'Host',
                  'User-Agent',
                  'Accept',
                  'Accept-Language',
                  'Accept-Encoding',
                  'Access-Control-Request-Method',
                  'Access-Control-Allow-Origin',
                  'Access-Control-Request-Headers',
                  'Origin',
                  'ETag',
                  'clientId',
                  'Connection',
                  'Pragma',
                  'Cache-Control',
                ],
              },
            },
          },
        },
      }),
    ]).subscribe(() => console.log('Started'), console.log.bind(console));
  }

  main();
}
