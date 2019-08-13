import { watch } from 'chokidar';
import { Config } from '../app/app.tokens';
import { reactToChanges } from './react-to-changes';

export function watchBundles(paths: string[], config: Config) {
  const ignored = (p: string) => p.includes('node_modules');
  watch([...new Set(paths)], { ignored }).on('change', async path =>
    reactToChanges(path, config)
  );
}
