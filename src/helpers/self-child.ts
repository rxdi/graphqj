import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Observable } from 'rxjs';

export const SelfChild = (configFile: string) => {
  return new Observable<ChildProcessWithoutNullStreams>(observer => {
    const args = []
    args.push('--config')
    args.push(configFile)
    const child = spawn('gj', args);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    process.on('exit', () => child.kill());
    observer.next(child);
    return () => {
      observer.complete();
      child.kill();
      console.log(`Child process: ${child.pid} killed`);
    };
  });
};
