import { isFunction } from './isFunction';

/**
 * Gets first item of the object without iterating all objects inside
 */
export function getFirstItemIfFuncton<T>(object: T) {
  if (!object) {
    return null;
  }
  let firstKey: string;
  for (const key in object) {
    firstKey = key;
    break;
  }
  if (!object[firstKey]) {
    throw new Error(`Missing method ${firstKey}`);
  }
  if (isFunction(object[firstKey])) {
    object = object[firstKey];
  }
  return object;
}
