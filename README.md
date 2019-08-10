# @rxdi/graphqj

Create easy Graphql server from `json`, `yml`, `graphql`, `js` or `ts` files

## Features

- Helps with prototyping MVP
- Creates graphql server from JSON file
- In about a minute you have working graphql API
- Graphql Voyager available
- Graphiql included in the pack for easy development

### What is `@rxdi/graphqj`

- Tool for creating Graphql backend from JSON for testing purposes and Client MVP's

### What is not `@rxdi/graphqj`

- A Production ready server (it is created only for MVP's)

> For production ready server check [@gapi/core](https://github.com/Stradivario/gapi)

## Installation

```bash
npm i -g @rxdi/graphqj
```

## Configuration

Define `gj.json` or execute `gj init`, 

`gj init` by default creates `basic` configuration with `json`

Available config templates:

`gj init {advanced | es6 | typescript | jml}`

Basic configuration

```json
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
```

Advanced configuration

```json
{
  "$mode": "advanced",
  "$types": {
    "User": {
      "name": "String",
      "email": "String",
      "phone": "number",
      "arrayOfNumbers": "number[]",
      "arrayOfStrings": "string[]"
    }
  },
  "$args": {
    "UserPayload": {
      "userId":"String!",
      "userId2":"String",
      "userId3":"String!",
      "userId4":"String",
    }
  },
  "$resolvers": {
    "findUser": {
      "type": "User",
      "args": {
        "userId":"String!",
        "userId":"String",
      },
      "resolve": {
        "name": "Kristiyan Tachev",
        "email": "test@gmail.com",
        "phone": 414141,
        "arrayOfNumbers": [515151, 412414],
        "arrayOfStrings": ["515151", "412414"]
      }
    },
    "findUserWithPayloadRequired": {
      "type": "User",
      "args": {
        "payload":"UserPayload!",
      },
      "resolve": {
        "name": "Kristiyan Tachev",
        "email": "test@gmail.com",
        "phone": 414141,
        "arrayOfNumbers": [515151, 412414],
        "arrayOfStrings": ["515151", "412414"]
      }
    },
  }
}
```


Schema:

```graphql
type Query {
  findUser: User
  status: StatusQueryType
}

type StatusQueryType {
  status: String
}

type User {
  name: String
  email: String
  phone: Int
  arrayOfNumbers: [Int]
}
```

Query:
```graphql
query {
  findUser {
    name
    email
    phone
    arrayOfNumbers
    arrayOfStrings
  }
}
```

Result:
```json
{
  "data": {
    "findUser": {
      "name": "Kristiyan Tachev",
      "email": "test@gmail.com",
      "phone": 414141,
      "arrayOfNumbers": [
        515151,
        412414
      ],
      "arrayOfStrings": [
        "515151",
        "412414"
      ]
    }
  }
}
```

## Starting server

This command will look for `gj.{json | js | ts | yml}` configuration inside working directory

```
gj
```

#### Changing port
Default port is `9000`
```
gj --port 5000
```

#### Generating `schema.graphql` from JSON

```
gj --generate
```


#### Spawn random PORT on every start

```
gj --random
```


#### Watch for changes with specific config

```
gj --config ./gj.{json|js|ts|yml} --watch
```

```
gj --config ./gj.yml --watch
```



## Advanced configuration

### Typescript

To be able to run config with typescript you need to install `@gapi/cli` globally
This will transpile our `typescript` file to `javascript` and load it automatically

```bash
npm i -g @gapi/cli
```

Filename: `gj.ts`
```typescript
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

```

### ES6

Filename: `gj.js`
```typescript
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

```

### YML

Filename: `gj.yml`
```yml

$mode: advanced
$types:
  User:
    name: String
    email: String
    phone: Number
    arrayOfNumbers: Number[]
    arrayOfStrings: String[]

$args:
  UserPayload:
    userId: String!
    userId2: String
    userId3: String
    userId4: String

$resolvers:
  findUser:
    type: User
    args:
      payload: UserPayload
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
    type: User
    args:
      payload: UserPayload
    resolve:
      name: Kristiyan Tachev
      email: test@gmail.com
      phone: 414141
      arrayOfNumbers: 
        - 515152
        - 412414
      arrayOfStrings:
        - '515151'
        - '412414'
```

### Loading existing generated schema

Filename: `gj.json`
```json
{
  "$schema": "./schema.graphql"
}
```

Or

```bash
gj --schema ./schema.graphql
```


### [Graphql Voyager](https://github.com/Stradivario/gapi-voyager) 

Open http://localhost:9000/voyager



## Aliases

`graphqj`, `gg`, `gj`


## Exclude

Exclude `.gj` folder inside your `.gitignore` or `.dockerignore` files

Folder `.gj` is working directory when we store transpiled `typescript` configuration file


## Experimental

```yml
$mode: advanced
$directives: ./examples/ts/directives.ts
$externals:
  - map: 🚀
    file: ./examples/ts/interceptors.ts
  - map: 🛡️
    file: ./examples/ts/guards.ts
  - map: 🕵️
    file: ./examples/ts/modifiers.ts
  - map: ⌛
    file: ./node_modules/moment/moment.js

$types:
  User:
    name: String => {🕵️OnlyAdmin}
    email: String => {🚀LoggerInterceptor}
    phone: Number => {🛡️IsLogged}
    arrayOfNumbers: Number[] => {🕵️OnlyAdmin}
    arrayOfStrings: String[]
    createdAt: String {⌛ToISO}

$args:
  UserPayload:
    userId: String!
    userId2: String
    userId3: String
    userId4: String

$resolvers:
  findUser:
    type: User
    args:
      payload: UserPayload
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
$views:
  home:
    query: findUser2
    payload: UserPayload
    html: |
      <bla-component></bla-component>
      {name} {email} {phone} {createdAt}
      A rich framework for building applications and services with GraphQL and Apollo inspired by Angular
```


#### Guard

```typescript
import { Observable } from 'rxjs';

export async function IsLogged(
  chainable$: Observable<any>,
  payload,
  context
) {
  if (!context.user) {
    throw new Error('Unauthorized');
  }
}
```

#### Interceptor

```typescript
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export async function LoggerInterceptor(
  chainable$: Observable<any>,
  context,
  payload,
  descriptor
) {
  console.log('Before...');
  const now = Date.now();
  return chainable$.pipe(
    tap(() => console.log(`After... ${Date.now() - now}ms`))
  );
}
```

#### Modifier

```typescript
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export async function OnlyAdmin(
  chainable$: Observable<any>,
  context,
  payload,
  descriptor
) {
  return chainable$.pipe(map(() => null));
}
```


#### Directives

```typescript
import {
  DirectiveLocation,
  GraphQLCustomDirective
} from '@gapi/core';

export async function toUppercase() {
  return new GraphQLCustomDirective<string>({
    name: 'toUpperCase',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    resolve: async resolve => (await resolve()).toUpperCase()
  });
}
```


#### Possible query

```graphql
{
  findUser {
    name
    email @toUpperCase @AddTextDirective(inside: "dada", outside: "dadada")
    phone
    arrayOfNumbers
    arrayOfStrings
  }
}
```