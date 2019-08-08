import {
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLObjectType
} from 'graphql';

export function MakeAdvancedSchema(config, bootstrap) {
  const types = {};

  Object.keys(config.$types).forEach(type => {
    if (types[type]) {
      return;
    }
    Object.keys(config.$types[type]).forEach(key => {
      types[type] = types[type] || {};
      if (config.$types[type][key] === 'string') {
        types[type][key] = { type: GraphQLString };
      }
      if (config.$types[type][key] === 'string[]') {
        types[type][key] = { type: new GraphQLList(GraphQLString) };
      }
      if (config.$types[type][key] === 'number') {
        types[type][key] = { type: GraphQLInt };
      }
      if (config.$types[type][key] === 'number[]') {
        types[type][key] = { type: new GraphQLList(GraphQLInt) };
      }
    });
    types[type] = new GraphQLObjectType({
      name: type,
      fields: types[type]
    });
  });

  Object.keys(config.$resolvers).forEach(method_name => {
    const resolve = config.$resolvers[method_name].resolve;
    const type = config.$resolvers[method_name].type;
    if (!types[type]) {
      throw new Error(
        `Missing type '${type}', Available types: '${Object.keys(
          types
        ).toString()}'`
      );
    }
    bootstrap.Fields.query[method_name] = {
      type: types[type],
      method_name,
      public: true,
      method_type: 'query',
      target: () => {},
      resolve: typeof resolve === 'function' ? resolve : () => resolve
    } as any;
  });
}
