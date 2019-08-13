import { watch } from 'chokidar';
import { loadFile } from './load-file';
import { Config } from '../app/app.tokens';
import { traverseAndLoadConfigs } from './traverse/traverse';
import { BootstrapService, Container } from '@gapi/core';

export function watchBundles(
  paths: string[],
  config: Config
) {
  const ignored = (p: string) => p.includes('node_modules');
  watch([...new Set(paths)], { ignored }).on(
    'change',
    async (path) => {
      const newModule = await loadFile(path);
      await traverseAndLoadConfigs(config);
      const schema = Container.get(BootstrapService).schema;
      schema.getQueryType().getFields()['findUser2'].resolve = newModule.findUser;
    }
  );
}
