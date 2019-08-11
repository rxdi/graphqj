import { TranspileTypescript } from './typescript.builder';
import { join, parse, isAbsolute } from 'path';
import { Externals } from '../app/app.tokens';
import { Container } from '@rxdi/core';

export async function TranspileAndLoad(path: string, outDir: string) {
  path = convertToRelative(path);
  if (Container.has(path)) {
    return Container.get(path);
  }
  await TranspileTypescript([path], outDir);
  const something = require(join(
    process.cwd(),
    outDir,
    parse(join(process.cwd(), outDir, path)).base.replace('ts', 'js')
  ));
  Container.set(path, something);
  return Container.get(path);
}

function convertToRelative(path: string) {
  path = path[0] === '.' ? path.substr(1) : path;
  return isAbsolute(path) ? (path = path.replace(process.cwd(), '')) : path;
}

export async function TranspileAndGetAll(externals: Externals[], outDir: string) {
  await TranspileTypescript(
    externals.map(external => external.file).map(path => convertToRelative(path)),
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
