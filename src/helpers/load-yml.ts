import { promisify } from 'util';
import { TranspileAndLoad } from './transpile-and-load';
import { exists, readFile } from 'fs';
import { load } from 'js-yaml';
import { isInValidPath } from './is-invalid-path';

export async function loadFile(path: string) {
  let m: any;
  if (isInValidPath(path)) {
    return path;
  }
  if (!(await promisify(exists)(path))) {
    throw new Error(`Missing external file for types ${path}`);
  }
  if (path.includes('.ts')) {
    m = await TranspileAndLoad(path.replace('.', ''), './.gj/out');
  } else if (path.includes('.yml')) {
    m = load(await promisify(readFile)(path, { encoding: 'utf-8' }));
  } else if (path.includes('.json')) {
    m = require(path);
  } else if (path.includes('.html')) {
    m = await promisify(readFile)(path, { encoding: 'utf-8' });
  } else {
    m = require('esm')(module)(path);
  }
  return m;
}
