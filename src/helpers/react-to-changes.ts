import { traverse } from './traverse/traverse';
import { BootstrapService, Container, ApolloService } from '@gapi/core';
import { getFirstItem } from './get-first-item';
import { loadFile } from './load-file';
import { Config } from '../app/app.tokens';
import { MakeAdvancedSchema } from './advanced-schema';
import { deep } from './traverse/test';
import { lazyTypes } from './lazy-types';
import { configWatchers } from './watch-bundles';
import { MakeBasicSchema } from './basic-schema';
import { transpilerCache } from './transpiler-cache';

function findMetaKey(path: string, meta: { [key: string]: string }) {
  return Object.keys(meta).find(k => meta[k] === path);
}

function getMetaPath(path: string) {
  return `.${path.replace(process.cwd(), '')}`;
}

let isRunning: boolean;

export async function reactToChanges(path: string, config: Config) {
  if (isRunning) {
    console.log(
      `✋  Bundle is updating previews change! Unable to update ${path}`
    );
    return;
  }
  const timer = Date.now();
  console.log(`💡  Bundle changed: ${path}`);
  isRunning = true;
  try {
    transpilerCache.delete(path.replace(process.cwd(), ''))
    transpilerCache.delete(path.replace(process.cwd(), '').replace('.', ''))
    const newFile = await loadFile(path);
    if (configWatchers.filter(p => path.includes(p)).length) {
      config = await deep(newFile);
    } else if (config._meta) {
      // First level deepnest
      const metaKey = findMetaKey(getMetaPath(path), config._meta);
      if (metaKey) {
        config[metaKey] = await deep(newFile);
      }
    } else {
      // Traverse recursive and find metadata for specific file and update it
      await traverse(config, async (k, v) => {
        if (typeof v === 'object' && v._meta) {
          const foundMetaKey = findMetaKey(getMetaPath(path), v._meta);
          if (foundMetaKey) {
            v[foundMetaKey] = await deep(getFirstItem(newFile));
            return true;
          }
        }
        return false;
      });
    }

    lazyTypes.clear();
    Container.get(BootstrapService).Fields = {
      mutation: {},
      query: {},
      subscription: {}
    };
    if (config.$mode === 'basic') {
      await MakeBasicSchema(config);
    }
    if (config.$mode === 'advanced') {
      await MakeAdvancedSchema(config);
    }
    Container.get(ApolloService).init();
    console.log(`📦  Bundle realoaded! ${Date.now() - timer}ms`, path);
    isRunning = false;
    // await SchemaIntrospection()
  } catch (e) {
    isRunning = false;
    console.error(e);
  }
}
