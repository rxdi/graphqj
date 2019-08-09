import { BootstrapFramework } from '@rxdi/core';
import { AppModule } from './app/app.module';
import { CoreModule } from '@gapi/core';
import { nextOrDefault, includes } from './helpers/args-extractors';
import { writeFile, existsSync } from 'fs';
import { promisify } from 'util';
import { watch } from 'chokidar';
import { SelfChild } from './helpers/self-child';
import { Subscription } from 'rxjs';

if (includes('--watch')) {
  let subscription: Subscription;
  const configPath = process.argv.slice(2)[0];
  if (!existsSync(configPath) && !configPath.includes('--')) {
    throw new Error(`File missing ${configPath}`)
  }
  const ignored = (p: string) => p.includes('node_modules');

  watch(configPath, { ignored }).on('change', async (event, path) => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = SelfChild().subscribe(process => {
      console.log('Child process started: ', process.pid);
    });
  });

  watch(configPath, { ignored }).on('ready', async (event, path) => {
    if (subscription) {
      subscription.unsubscribe();
    }
    subscription = SelfChild().subscribe(process => {
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
  BootstrapFramework(AppModule, [
    CoreModule.forRoot({
      graphql: {
        openBrowser: nextOrDefault('--random', true, v =>
          v === 'true' ? false : true
        )
      },
      server: {
        randomPort: nextOrDefault('--random', false),
        hapi: {
          port: nextOrDefault('--port', 9000, p => Number(p))
        }
      }
    })
  ]).subscribe(() => console.log('Started'), console.log.bind(console));
}
