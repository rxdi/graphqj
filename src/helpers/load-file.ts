import { promisify } from 'util';
import { TranspileAndLoad } from './transpile-and-load';
import { exists, readFile } from 'fs';
import { isInValidPath } from './is-invalid-path';
import { traverseMap } from './traverse-map';
import { join, normalize } from 'path';
import { loadYml } from './load-yml';
import { IsBundlerInstalled } from '../app/app.tokens';
import clearModule = require('clear-module');
import { Container } from '@rxdi/core';

export async function loadFile(path: string) {
  let loadedModule: any;
  if (isInValidPath(path)) {
    return path;
  }
  if (!(await promisify(exists)(path))) {
    const lastElement = traverseMap[traverseMap.length - 1];
    if (lastElement) {
      path = join(
        process.cwd(),
        lastElement.parent,
        path.replace(process.cwd(), '')
      );
    }
  }
  if (path.includes('.yml')) {
    loadedModule = loadYml(path);
  } else if (path.includes('.json')) {
    path = normalize(join(process.cwd(), path));
    clearModule(path)
    loadedModule = require(path);
  } else if (path.includes('.html') || path.includes('.graphql') || path.includes('.gql')) {
    loadedModule = await promisify(readFile)(path, { encoding: 'utf-8' });
  } else if (Container.get(IsBundlerInstalled).gapi && path.includes('.ts') || path.includes('.js')) {
    loadedModule = await TranspileAndLoad(path, './.gj/out');
  }  else {
    loadedModule = require('esm')(module, {cache: false})(path);
  }

  const parent = path
    .substring(0, path.lastIndexOf('/'))
    .replace(process.cwd(), '');

  traverseMap.push({ parent, path });
  return loadedModule;
}
