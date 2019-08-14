import { promisify } from 'util';
import { TranspileAndLoad } from './transpile-and-load';
import { exists, readFile } from 'fs';
import { isInValidPath } from './is-invalid-path';
import { traverseMap } from './traverse-map';
import { join } from 'path';
import { loadYml } from './load-yml';
import { isGapiInstalled } from './is-runner-installed';

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

  if (await isGapiInstalled() && (path.includes('.ts') || path.includes('.js'))) {
    loadedModule = await TranspileAndLoad(path, './.gj/out');
  } else if (path.includes('.yml')) {
    loadedModule = loadYml(path);
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

  traverseMap.push({ parent, path });
  return loadedModule;
}
