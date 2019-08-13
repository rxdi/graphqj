import { isFunction } from './isFunction';

export function getFirstItem<T>(object: T) {
  /* Take the first method inside item */
  let firstKey: string;
  for (var key in object) {
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
