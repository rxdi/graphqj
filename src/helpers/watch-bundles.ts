import { watch } from 'chokidar';
import { Config } from '../app/app.tokens';
import { reactToChanges } from './react-to-changes';

const configWatchers = ['./gj.yml', './gj.json', './gj.js', './gj.ts'];

export function watchBundles(paths: string[], config: Config) {
  const ignored = (p: string) => p.includes('node_modules');
  watch([...new Set(paths), ...configWatchers], { ignored }).on(
    'change',
    async path => reactToChanges(path, config)
  );
}
