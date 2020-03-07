import { isArray } from '../is-array';

export async function traverse<T>(x: T, find: (k: string, v: T) => Promise<boolean>) {
  if (isArray(x)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await traverseArray(x, find);
  } else if (typeof x === 'object' && x !== null) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await traverseObject(x, find);
  }
  null;
}

export async function traverseObject<T>(obj: T, find: (k: string, v: T) => Promise<boolean>) {
  for (const [k, v] of Object.entries(obj)) {
    if (obj.hasOwnProperty(k)) {
      if (await find(k, v)) {
        break;
      } else {
        await traverse(obj[k], find);
      }
    }
  }
}

export async function traverseArray<T>(arr: T, find: (k: string, v: T) => Promise<boolean>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const x of arr as any) {
    return await traverse(x, find);
  }
}
