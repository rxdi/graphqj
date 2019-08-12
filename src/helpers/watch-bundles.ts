import { watch } from 'chokidar';
import { loadFile } from './load-file';
import { Stats } from 'fs';
import { Config } from '../app/app.tokens';
import { traverseAndLoadConfigs } from './traverse/traverse';
import { BootstrapService } from '@gapi/core';

export function watchBundles(paths: string[], config: Config, bootstrap: BootstrapService) {
  const ignored = (p: string) => p.includes('node_modules');
  watch([...new Set(paths)], { ignored }).on('change', async (path, stats: Stats) => {
    const test = await loadFile(path)
    console.log(test)
    await traverseAndLoadConfigs(config);
    bootstrap.Fields.query['findUser'].resolve = function () {

    }
  });
}
