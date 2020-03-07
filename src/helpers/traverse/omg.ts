import { Container } from '@rxdi/core';
import { FSWatcher } from 'chokidar';
import { join } from 'path';

import { loadFile } from '../load-file';

export async function deepArray<T>(collection: T[]) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return await Promise.all(collection.map(async value => deep(value)));
}

export async function deep<T>(value: T): Promise<T> {
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  if (Array.isArray(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return deepArray(value) as any;
  }
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return deepObject(value);
}

export function replaceInjectSymbol(path: string) {
  return path.replace('💉', '');
}

export async function deepObject<T>(source: T) {
  const result = {};
  let path: string;
  const meta = {};
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'string' && value.includes('💉')) {
      path = `${replaceInjectSymbol(value)}`;
      const mod = await loadFile(join(process.cwd(), path));
      result[key] = await deep(mod);
      meta[key] = path;
      try {
        Container.get<FSWatcher>('watcher').add(join(process.cwd(), path));
      } catch (e) {}
      Object.defineProperty(result, `_meta`, { value: meta, enumerable: false, writable: true });
    } else {
      result[key] = await deep(value);
    }
  }
  return result as T;
}

export const meta = new Map<string, string>();
