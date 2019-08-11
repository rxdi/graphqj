export function isArray<T>(o: T) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
