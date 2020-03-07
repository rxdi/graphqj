import { Container } from '@rxdi/core';
import { watch } from 'chokidar';

import { Config } from '../app/app.tokens';
import { reactToChanges } from './react-to-changes';

export const configWatchers = ['gj.yml', 'gj.json', 'gj.js', 'gj.ts'];
export function watchBundles(paths: string[], config: Config) {
  const ignored = (p: string) => p.includes('node_modules');

  const watcher = watch([...new Set(paths), ...configWatchers.map(p => `./${p}`)], { ignored }).on(
    'change',
    async path => reactToChanges(path, config),
  );
  Container.set('watcher', watcher);
}

// @Injectable()
// export class BundleWatcher {
//   private configWatchers = ['./gj.yml', './gj.json', './gj.js', './gj.ts'];
//   private ignored = (p: string) => p.includes('node_modules');
//   private watcher: FSWatcher;
//   constructor() {
//     this.watcher = watch([...this.configWatchers], {
//       ignored: this.ignored
//     })
//   }
//   unwatch(path: string[] | string) {
//     this.watcher.unwatch(path);
//   }
//   addBundles(paths: string[]) {
//     this.watcher.add(paths);
//   }
//   onChange(config: Config) {
//     this.watcher.on('change', async path => reactToChanges(path, config));
//   }
//   stop() {
//     this.watcher.close();
//   }

//   getWatcher() {
//     return this.watcher;
//   }
// }
