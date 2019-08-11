import { traverseAndLoadConfigs } from './traverse';

export async function traverseArray<T>(arr: T) {
  for (const x of arr as any) {
    await traverseAndLoadConfigs(x);
  }
}
