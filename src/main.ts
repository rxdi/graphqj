import { BootstrapFramework } from '@rxdi/core';
import { AppModule } from './app/app.module';
import { CoreModule } from '@gapi/core';
import { nextOrDefault, includes } from './helpers/args-extractors';
import { writeFile } from 'fs';
import { promisify } from 'util';

if (includes('init')) {
  if (includes('advanced')) {
    promisify(writeFile)(
      './gj.json',
      `
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
        openBrowser: nextOrDefault('--random', true, (v) => v === 'true' ? false : true)
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
