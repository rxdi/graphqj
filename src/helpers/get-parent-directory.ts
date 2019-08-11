export function getParentDirectory(path: string) {
  return path.substring(0, path.lastIndexOf('/')).replace(process.cwd(), '');
}
