import { parse } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInValidPath(path: string, options = {} as { extended: boolean; file: string }) {
  if (path === '' || typeof path !== 'string') return true;

  // https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#maxpath
  const MAX_PATH = options.extended ? 32767 : 260;
  if (typeof path !== 'string' || path.length > MAX_PATH - 12) {
    return true;
  }

  const rootPath = parse(path).root;
  if (rootPath) path = path.slice(rootPath.length);

  // https://msdn.microsoft.com/en-us/library/windows/desktop/aa365247(v=vs.85).aspx#Naming_Conventions
  if (options.file) {
    return /[<>:"/\\|?*]/.test(path);
  }
  return /[<>:"|?*]/.test(path);
}
