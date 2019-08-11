import { isArray } from '../is-array';
import { traverseArray } from './traverse-array';
import { traverseObject } from './traverse-object';

export async function traverseAndLoadConfigs<T>(x: T) {
  if (isArray(x)) {
    await traverseArray(x);
  } else if (typeof x === 'object' && x !== null) {
    await traverseObject(x);
  }
}
