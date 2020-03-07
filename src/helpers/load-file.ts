import { exists, readFile } from 'fs';
import { basename, join, normalize } from 'path';
import { promisify } from 'util';

import { IsBundlerInstalled } from '../app/app.tokens';
import { isInValidPath } from './is-invalid-path';
import { loadYml } from './load-yml';
import { TranspileAndLoad } from './transpile-and-load';
import { traverseMap } from './traverse-map';
import clearModule = require('clear-module');
import { Container } from '@rxdi/core';

export async function loadFile(path: string) {
  let loadedModule: unknown;
  if (isInValidPath(path)) {
    return path;
  }
  if (!(await promisify(exists)(path))) {
    const lastElement = traverseMap[traverseMap.length - 1];
    if (lastElement) {
      path = join(process.cwd(), lastElement.parent, path.replace(process.cwd(), ''));
      if (!(await promisify(exists)(path))) {
        path = join(process.cwd(), lastElement.parent, basename(path));
      }
    }
  }
  if (path.includes('.yml')) {
    loadedModule = loadYml(path);
  } else if (path.includes('.json')) {
    path = normalize(join(process.cwd(), path));
    clearModule(path);
    loadedModule = require(path);
  } else if (path.includes('.html') || path.includes('.graphql') || path.includes('.gql')) {
    loadedModule = await promisify(readFile)(path, { encoding: 'utf-8' });
  } else if ((Container.get(IsBundlerInstalled).gapi && path.includes('.ts')) || path.includes('.js')) {
    loadedModule = await TranspileAndLoad(path, './.gj/out');
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    loadedModule = require('esm')(module, { cache: false })(path);
  }

  const parent = path.substring(0, path.lastIndexOf('/')).replace(process.cwd(), '');

  traverseMap.push({ parent, path });
  return loadedModule;
}
