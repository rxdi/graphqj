import { spawn } from 'child_process';

export const TranspileTypescript = (paths: string[] = [], outDir: string) => {
  if (!paths.length) {
    return Promise.resolve(0)
  }
  return new Promise((resolve, reject) => {
    const child = spawn('npx', [
      'gapi',
      'build',
      '--glob',
      `${paths.toString()}`,
      '--outDir',
      outDir
    ]);
    // child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code: number) => resolve(code));
  });
};
