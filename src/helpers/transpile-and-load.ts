import { TranspileTypescript } from './typescript.builder';
import { join, parse } from 'path';
import { Externals } from '../app/app.tokens';

export async function TranspileAndLoad(path: string, outDir: string) {
  await TranspileTypescript([path], outDir);
  return require(join(
    process.cwd(),
    outDir,
    parse(join(process.cwd(), outDir, path)).base.replace('ts', 'js')
  ));
}

export async function TranspileAndGetAll(paths: Externals[], outDir: string) {
  await TranspileTypescript(
    paths.map(external => external.file).map(f => f.replace('.', '')),
    outDir
  );
  return paths.map(path => ({
    ...path,
    transpiledFile: join(
      process.cwd(),
      outDir,
      parse(path.file).base.replace('ts', 'js')
    )
  }));
}
