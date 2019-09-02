# @rxdi/graphqj

Create easy Graphql server from `json`, `yml`, `graphql`, `js` or `ts` files

## Features

- Graphql Voyager available
- Helps with prototyping MVP
- In about a minute you have working graphql API
- Graphiql included in the pack for easy development
- Watch and rebuild GQL Schema dynamically without restarting server
- It provides HotRealod of Graphql Schema without rebuilding or restarting application.Everyting is happening on Runtime.
### What is `@rxdi/graphqj`

- Tool for creating Graphql backend from Different source for testing purposes and Client MVP's

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
#### Hot reload of Bundles (Beta)
```
gj --hot-reload
```

#### Build client side application inside Configuration file (Beta)
```
gj --client
```

#### Generating `schema.graphql` from JSON

```
gj --generate
```


#### Spawn random PORT on every start

```
gj --random
```

#### Try experimental HOT Module reload when developing client side application

```
gj --client --hot-reload
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


## Experimental 📡

```yml
$mode: advanced
$directives: ./directives.ts
$externals:
  - map: 🛰
    file: ./interceptors.ts
  - map: 🛡️
    file: ./guards.ts
  - map: 🕵️
    file: ./modifiers.ts
  - map: ⌛
    file: ./helpers/moment.js

$types:
  User:
    name: String => {🕵️OnlyAdmin}
    email: String => {🛰LoggerInterceptor}
    phone: Number => {🛡️IsLogged}
    arrayOfNumbers: Number[] => {🕵️OnlyAdmin}
    arrayOfStrings: String[]
    createdAt: String => {⌛fromNow}

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
    query: findUser
    props: User
    output: UserPayload
    html: |
      <bla-component></bla-component>
      {userId} {name} {email} {phone} {createdAt}
      A rich framework for building applications and services with GraphQL and Apollo inspired by Angular
```

Moment helper

```typescript
import moment from 'moment';

export function fromNow() {
  return moment('20111031', 'YYYYMMDD').fromNow();
}
```

Chaining multiple `$externals` is quite easy

```yml
email: String => {🛰LoggerInterceptor} => {🛡️IsLogged} => {🕵️OnlyAdmin}
```

#### Magics

With Syringe `💉` operator you can inject `yml`, `js`, `ts`, `json`, `graphql` and `html` files,

```yml
$views:
  home:
    query: findUser2
    payload: UserPayload
    html: 💉./my.html
```

You can compose anything inside `gj.yml`

```yml
$mode: advanced
$directives: ./directives.ts
$externals:
  - map: 🛰
    file: ./interceptors.ts
  - map: 🛡️
    file: ./guards.ts
  - map: 🕵️
    file: ./modifiers.ts

$types: 💉./types.yml
$args: 💉./args.yml
$resolvers: 💉./resolvers.yml

$views:
  home:
    query: findUser2
    payload: UserPayload
    html: 💉./test.html
```

Even defining `Graphql` resolvers is simply easy

```yml
$mode: advanced
$resolvers:
  findUser:
    type: User
    args:
      payload: UserPayload
    resolve: 💉./findUser.ts
```

#### Resolver

```typescript
import { Observable } from 'rxjs';
import { IUserType } from '@api';

export async function findUser(root, payload, context, info):
  | Promise<Observable<IUserType>>
  | Promise<IUserType>
  | Observable<IUserType>
  | IUserType {
  return {
    name: 'dada',
    email: 'dada',
    phone: 13131,
    arrayOfNumbers: [111, 222],
    arrayOfStrings: ['dada', 'dada']
  };
}
```


#### Guard

```typescript
import { Observable } from 'rxjs';

export async function IsLogged(
  chainable$: Observable<any>,
  root,
  payload,
  context,
  descriptor
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
  root,
  payload,
  context,
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
  root,
  payload,
  context,
  descriptor
) {
  return chainable$.pipe(map(() => null));
}
```


#### Directives

```typescript
import {
  DirectiveLocation,
  GraphQLCustomDirective,
  GraphQLNonNull,
  GraphQLString
} from '@gapi/core';

export async function toUppercase() {
  return new GraphQLCustomDirective({
    name: 'toUpperCase',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    resolve: async resolve => (await resolve()).toUpperCase()
  });
}

export async function AddTextDirective() {
  return new GraphQLCustomDirective({
    name: 'AddTextDirective',
    description: 'change the case of a string to uppercase',
    locations: [DirectiveLocation.FIELD],
    args: {
      inside: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'the times to duplicate the string'
      },
      outside: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'the times to duplicate the string'
      }
    },
    resolve: async (
      resolve,
      root,
      args
    ) => args.inside + (await resolve()) + args.outside
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

#### Omg YML
Defining `javascript` function in `yml`

```yml
$omg: !!js/function >
  function foobar() {
    return 'Wow! JS-YAML Rocks!';
  }
```

Defining JS function in resolver

```yml
$resolvers:
  findUser:
    type: User
    args:
      payload: UserPayload
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
```



Possible flows

```yml
seq:
  # Ordered sequence of nodes
  Block style: !!seq
  - Mercury   # Rotates - no light/dark sides.
  - Venus     # Deadliest. Aptly named.
  - Earth     # Mostly dirt.
  - Mars      # Seems empty.
  - Jupiter   # The king.
  - Saturn    # Pretty.
  - Uranus    # Where the sun hardly shines.
  - Neptune   # Boring. No rings.
  - Pluto     # You call this a planet?
  Flow style: !!seq [ Mercury, Venus, Earth, Mars,      # Rocks
                      Jupiter, Saturn, Uranus, Neptune, # Gas
                      Pluto ]                           # Overrated
```

Will create the following json object

```json
{
   "seq":{
      "Block style":[
         "Mercury",
         "Venus",
         "Earth",
         "Mars",
         "Jupiter",
         "Saturn",
         "Uranus",
         "Neptune",
         "Pluto"
      ],
      "Flow style":[
         "Mercury",
         "Venus",
         "Earth",
         "Mars",
         "Jupiter",
         "Saturn",
         "Uranus",
         "Neptune",
         "Pluto"
      ]
   }
}
```



Dependencies can be injected also

Define inside `$externals` following:
```yml
$externals:
  - map: 🕵️
    file: ./my-functions.js
```

Where `./my-functions.js` looks like this

```typescript
export async function test() {
  return {};
}
export async function test2() {
  return {};
}
export async function test3() {
  return {};
}
```

Then you can inject these functions and use them

```yml
findUser:
  deps: [{ provide: 🕵️, map: 'myFunctions'}]
  type: User
  args:
    payload: UserPayload
  resolve: !!js/function >
    function foobar(root, payload, context, info) {
      console.log(this.myFunctions.test()) // {}
      console.log(this.myFunctions.test2()) // {}
      console.log(this.myFunctions.test3()) // {}
      return {
        "name": "Kristiyan Tachev",
        "email": "test@gmail.com",
        "phone": 414141,
        "arrayOfNumbers": [515151, 412414],
        "arrayOfStrings": ['515151', '412414']
      }
    }

findUser2: 💉./resolvers/findUser.resolver.yml
```


# Possible view configuration

```yml
$mode: advanced
# $imports:
#   - 💉./examples/mix/hamburger/server/hamburger.server.module.ts
# $components:
#   - 💉./examples/mix/hamburger/client/hamburger.client.module.ts

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
        return {
          "name": "Кристиян Тачев",
          "arrayOfStrings": ["dada", "dada"],
          "email": "kristiqn.tachev@gmail.com",
          "phone": 876667537
        }
      }

$views:
  app:
    components:

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
        <li><a href="/gosho">Gosho</a></li>
        <li><a href="/gosho444">Gosho444</a></li>
        <li><a href="/dadada">1</a></li>
        <li><a href="/dadada">2</a></li>
        <li><a href="/dadada">3</a></li>
        <li><a href="/dadada">4</a></li>
        <li><a href="/dadada">5</a></li>
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
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      {arrayOfStrings}
      <div style="background-color: red">
        <hamburger-component type="3dx" active=true enableBackendStatistics=${true}></hamburger-component>
      </div>

  not-found:
    html: |
      Not found
  gosho:
    query: findUser
    html: |
      Welcome to Gosho
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>

  dadada:
    html: |
      Welcome to Dadada

```