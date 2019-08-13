import { TranspileTypescript } from './typescript.builder';
import { join, parse, isAbsolute } from 'path';
import { Externals } from '../app/app.tokens';
// import { transpilerCache } from './transpiler-cache';
const clearModule = require('clear-module');

export async function TranspileAndLoad(path: string, outDir: string) {
  path = convertToRelative(path);
  // if (transpilerCache.has(path)) {
  //   return transpilerCache.get(path);
  // }
  await TranspileTypescript([path], outDir);
  Object.keys(require.cache).forEach(function(key) { delete require.cache[key] })
  clearModule(getTranspiledFilePath(path, outDir))
  const file = require(getTranspiledFilePath(path, outDir));
  // transpilerCache.set(path, file);
  return file;
}

function getTranspiledFilePath(path: string, outDir: string) {
  return join(
    process.cwd(),
    outDir,
    parse(join(process.cwd(), outDir, path)).base.replace('ts', 'js')
  );
}

function convertToRelative(path: string) {
  path = path[0] === '.' ? path.substr(1) : path;
  return isAbsolute(path) ? (path = path.replace(process.cwd(), '')) : path;
}

export async function TranspileAndGetAll(
  externals: Externals[],
  outDir: string
) {
  await TranspileTypescript(
    externals
      .map(external => external.file)
      .map(path => convertToRelative(path)),
    outDir
  );
  return externals.map(path => ({
    ...path,
    transpiledFile: join(
      process.cwd(),
      outDir,
      parse(path.file).base.replace('ts', 'js')
    )
  }));
}
