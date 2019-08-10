import { TranspileTypescript } from './typescript.builder';
import { join } from 'path';

export async function TranspileAndLoad(path: string, outDir: string) {
  await TranspileTypescript([path], outDir);
  return require(join(process.cwd(), outDir, path));
}
