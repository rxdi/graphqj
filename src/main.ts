import { BootstrapFramework, Container } from '@rxdi/core';
import { AppModule } from './app/app.module';
import { CoreModule } from '@gapi/core';
import { nextOrDefault, includes } from './helpers/args-extractors';
import { writeFile, existsSync } from 'fs';
import { promisify } from 'util';
import { watch } from 'chokidar';
import { SelfChild } from './helpers/self-child';
import { Subscription } from 'rxjs';
import { Config } from './app/app.tokens';

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
      { encoding: 'utf-8' }
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
      { encoding: 'utf-8' }
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
      { encoding: 'utf-8' }
    );
  } else if (includes('yml')) {
    promisify(writeFile)(
      './gj.yml',
      `
$mode: advanced
$types:
  user:
    name: String
    email: String
    phone: Number
    arrayOfNumbers: Number[]
    arrayOfStrings: String[]

$resolvers:
  findUser:
    type: user
    args:
      userId: String
    resolve:
      name: Kristiyan Tachev
      email: test@gmail.com
      phone: 414141
      arrayOfNumbers: 
        - 515151
        - 412414
      arrayOfStrings:
        - '515151'
        - '412414'

  findUser2:
    type: user
    args:
      userId: String!
    resolve:
      name: Kristiyan Tachev
      email: test@gmail.com
      phone: 414141
      arrayOfNumbers: 
        - 515151
        - 412414
      arrayOfStrings:
        - '515151'
        - '412414'
`,
      { encoding: 'utf-8' }
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
      { encoding: 'utf-8' }
    );
  }
} else {
  Container.set('pubsub-auth', {
    onSubConnection(connectionParams) {
      return connectionParams;
    },
    async onSubOperation(connectionParams, params, webSocket) {
      connectionParams
      return params;
    }
  });
  BootstrapFramework(AppModule, [
    CoreModule.forRoot({
      graphql: {
        openBrowser: nextOrDefault('--random', true, v =>
          v === 'true' ? false : true
        ),
        buildAstDefinitions: false // Removed ast definition since directives are lost,
      },
      pubsub: {
        authentication: 'pubsub-auth'
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
                'Connection',
                'Pragma',
                'Cache-Control'
              ]
            }
          }
        }
      }
    })
  ]).subscribe(() => console.log('Started'), console.log.bind(console));
}
