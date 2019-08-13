import { isArray } from '../is-array';
import { traverseArray } from './traverse-array';
import { traverseObject, traverseObjectForInjectables } from './traverse-object';

export async function traverseAndLoadConfigs<T>(x: T) {
  if (isArray(x)) {
    await traverseArray(x);
  } else if (typeof x === 'object' && x !== null) {
    await traverseObject(x);
  }
}

export async function traverseAndGetInjectables<T>(x: T, paths: {query: string; filePath: string;}[]) {
  if (typeof x === 'object' && x !== null) {
    await traverseObjectForInjectables(x, paths);
  }
}
