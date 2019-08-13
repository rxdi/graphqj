import { traverseAndLoadConfigs } from './traverse/traverse';
import { BootstrapService, Container } from '@gapi/core';
import { getFirstItem } from './get-first-item';
import { loadFile } from './load-file';
import { Config } from '../app/app.tokens';

export async function reactToChanges(path: string, config: Config) {
  const newModule = await loadFile(path);
  await traverseAndLoadConfigs(config);
  const schema = Container.get(BootstrapService).schema;
  schema.getQueryType().getFields()['findUser2'].resolve = getFirstItem(
    newModule
  );
}
