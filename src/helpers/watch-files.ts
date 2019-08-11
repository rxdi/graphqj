import { watch } from 'chokidar';
import { loadFile } from './load-file';
import { Stats } from 'fs';
import { Container } from '@rxdi/core';
import { Config } from '../app/app.tokens';
import { traverseAndLoadConfigs } from './traverse/traverse';

export function watchBundles(paths: string[]) {
  const ignored = (p: string) => p.includes('node_modules');
  watch(paths, { ignored }).on('change', async (path, stats: Stats) => {
    const config = await Container.get(Config)
    const test = await loadFile(path)
    await traverseAndLoadConfigs(config);

    console.log(test);
  });
}
