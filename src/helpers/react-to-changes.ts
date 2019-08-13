import { traverseAndLoadConfigs } from './traverse/traverse';
import { BootstrapService, Container, ApolloService } from '@gapi/core';
import { getFirstItem } from './get-first-item';
import { loadFile } from './load-file';
import { Config } from '../app/app.tokens';
import { SchemaIntrospection } from './schema-introspection';
import { MakeAdvancedSchema } from './advanced-schema';

export async function reactToChanges(path: string, config: Config) {
  const newModule = await loadFile(path);
  await traverseAndLoadConfigs(config);
  console.log(config.$resolvers.findUser2)

  const bootstrap = Container.get(BootstrapService);
  const apollo = Container.get(ApolloService);
  await MakeAdvancedSchema(config, bootstrap);
  apollo.init();
  // await SchemaIntrospection()
}
