import { spawn } from 'child_process';

export const SchemaIntrospection = () => {
  return new Promise(resolve => {
    const child = spawn('npx', ['gapi', 'schema', 'introspect', '--collect-documents', '--collect-types']);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('close', (code: number) => resolve(code));
  });
};
