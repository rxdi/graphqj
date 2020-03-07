import { ApolloService, BootstrapService, Container, PubSubService } from '@gapi/core';
import { basename } from 'path';

import { Config, IPredictedTranspilation } from '../app/app.tokens';
import { MakeAdvancedSchema } from './advanced-schema';
import { MakeBasicSchema } from './basic-schema';
import { transpileComponentsForViews, transpileComponentsInit } from './component.parser';
import { getFirstItem } from './get-first-item';
import { lazyTypes } from './lazy-types';
import { loadFile } from './load-file';
import { transpilerCache } from './transpiler-cache';
import { deep } from './traverse/omg';
import { traverse } from './traverse/traverse';
import { configWatchers } from './watch-bundles';

function findMetaKey(path: string, meta: { [key: string]: string }) {
  return Object.keys(meta).find(k => meta[k] === path || basename(meta[k]).includes(basename(path)));
}

function getMetaPath(path: string) {
  return `.${path.replace(process.cwd(), '')}`;
}

let isRunning: boolean;

export async function reactToChanges(path: string, config: Config) {
  if (isRunning) {
    console.log(`✋  Bundle is updating previews change! Unable to update ${path}`);
    isRunning = false;
    return;
  }
  const timer = Date.now();
  console.log(`💡  Bundle changed: ${path}`);
  isRunning = true;
  async function traverseConfig(path: string, file: string, config: Config) {
    await traverse(config, async (k, v) => {
      if (typeof v === 'object' && v._meta) {
        const metaPath = getMetaPath(path);
        const foundMetaKey = findMetaKey(metaPath, v._meta);
        if (foundMetaKey) {
          v[foundMetaKey] = await deep(getFirstItem(file));
          return true;
        }
      }
      return false;
    });
    return config;
  }
  try {
    transpilerCache.delete(path.replace(process.cwd(), ''));
    transpilerCache.delete(path.replace(process.cwd(), '').replace('.', ''));
    const newFile = await loadFile(path);
    let metaKey: string;
    if (config._meta) {
      metaKey = findMetaKey(getMetaPath(path), config._meta);
    }
    if (configWatchers.filter(p => path.includes(p)).length) {
      config = await deep(newFile);
    } else if (config._meta && metaKey) {
      // First level deepnest
      config[metaKey] = await deep(newFile);
    } else {
      // Traverse recursive and find metadata for specific file and update it
      config = await traverseConfig(path, newFile, config);
    }

    lazyTypes.clear();
    Container.get(BootstrapService).Fields = {
      mutation: {},
      query: {},
      subscription: {},
    };
    if (config.$mode === 'basic') {
      await MakeBasicSchema(config);
    }
    if (config.$mode === 'advanced') {
      await MakeAdvancedSchema(config);
    }
    Container.get(ApolloService).init();
    // await SchemaIntrospection()
  } catch (e) {
    console.error(e);
  }
  isRunning = false;
  if (config.$views) {
    config.$views = await transpileComponentsForViews(config.$views);
  }

  if (config.$components) {
    config.$components = (await transpileComponentsInit(config.$components as IPredictedTranspilation[])).map(c =>
      c && c.link ? c.link : c,
    ) as IPredictedTranspilation[];
  }

  Container.reset(Config);
  Container.remove(Config);
  Container.set(Config, config);
  if (config.$views) {
    Container.get(PubSubService).publish('listenForChanges', config.$views);
  }
  Container.reset('main-config-compiled');
  Container.remove('main-config-compiled');
  Container.set('main-config-compiled', config);
  console.log(`📦  Bundle realoaded! ${Date.now() - timer}ms`, path);
}
