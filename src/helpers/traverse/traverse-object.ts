import { traverseAndLoadConfigs } from './traverse';
import { loadFile } from '../load-file';
import { join } from 'path';

export async function traverseObject<T>(obj: T) {
  for (let [k, v] of Object.entries(obj)) {
    if (obj.hasOwnProperty(k)) {
      if (typeof obj[k] === 'string' && obj[k].includes('💉')) {
        obj[k] = await loadFile(join(process.cwd(), obj[k].replace('💉', '')));
      }
      await traverseAndLoadConfigs(obj[k]);
    }
  }
}
