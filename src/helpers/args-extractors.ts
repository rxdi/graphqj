export const includes = i => process.argv.toString().includes(i);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nextOrDefault = (i, fb: any = true, type = p => p) => {
  if (process.argv.toString().includes(i)) {
    const isNextArgumentPresent = process.argv[process.argv.indexOf(i) + 1];
    if (!isNextArgumentPresent) {
      return fb;
    }
    if (isNextArgumentPresent.includes('--')) {
      return fb;
    }
    return type(isNextArgumentPresent);
  }
  return fb;
};
