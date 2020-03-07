export const objToArray = <T>(a: { [key: string]: T }): Array<T> =>
  Object.keys(a).reduce((acc, curr) => [...acc, a[curr]], []);
