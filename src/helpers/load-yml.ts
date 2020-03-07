import { readFile } from 'fs';
import { load } from 'js-yaml';
import { promisify } from 'util';

export async function loadYml(path: string) {
  return load(await promisify(readFile)(path, { encoding: 'utf-8' })) as string;
}
