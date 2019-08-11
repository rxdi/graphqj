export function* recursiveIterator(obj: {
  children: any;
}): IterableIterator<any> {
  yield obj;
  for (const child of obj.children) {
    yield* recursiveIterator(child);
  }
}
