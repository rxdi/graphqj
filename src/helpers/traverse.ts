import { loadFile } from './load-yml';
import { join } from 'path';

export async function traverseAndLoadConfigs<T>(x: T) {
  if (isArray(x)) {
    await traverseArray(x);
  } else if (typeof x === 'object' && x !== null) {
    await traverseObject(x);
  }
}

async function traverseArray<T>(arr: T) {
  for (const x of arr as any) {
    await traverseAndLoadConfigs(x);
  }
}

async function traverseObject<T>(obj: T) {
  for (let [k, v] of Object.entries(obj)) {
    if (obj.hasOwnProperty(k)) {
      if (typeof obj[k] === 'string' && obj[k].includes('💉')) {
        obj[k] = await loadFile(join(process.cwd(), obj[k].replace('💉', '')));
      }
      await traverseAndLoadConfigs(obj[k]);
    }
  }
}

function isArray<T>(o: T) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

export function* recursiveIterator(obj): IterableIterator<any> {
  yield obj;
  for (const child of obj.children) {
    yield* recursiveIterator(child);
  }
}
