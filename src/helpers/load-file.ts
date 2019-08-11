import { promisify } from 'util';
import { TranspileAndLoad } from './transpile-and-load';
import { exists, readFile } from 'fs';
import { load } from 'js-yaml';
import { isInValidPath } from './is-invalid-path';
import { traverseMap } from './traverse-map';
import { join } from 'path';

const moduleCache = new Map();

export async function loadFile(path: string) {
  let loadedModule: any;
  if (moduleCache.has(path)) {
    return moduleCache.get(path);
  }
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

  if (path.includes('.ts')) {
    loadedModule = await TranspileAndLoad(path, './.gj/out');
  } else if (path.includes('.yml')) {
    loadedModule = load(await promisify(readFile)(path, { encoding: 'utf-8' }));
  } else if (path.includes('.json')) {
    loadedModule = require(path);
  } else if (path.includes('.html')) {
    loadedModule = await promisify(readFile)(path, { encoding: 'utf-8' });
  } else {
    loadedModule = require('esm')(module)(path);
  }

  const parent = path
    .substring(0, path.lastIndexOf('/'))
    .replace(process.cwd(), '');

  loadedModule.constructor.$parent = parent;
  traverseMap.push({ parent, path });
  moduleCache.set(path, loadedModule);
  return loadedModule;
}
