import { promisify } from 'util';
import { load } from 'js-yaml';
import { readFile } from 'fs';

export async function loadYml(path: string) {
  return load(await promisify(readFile)(path, { encoding: 'utf-8' }));
}
