import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Observable } from 'rxjs';

export const SelfChild = () => {
  return new Observable<ChildProcessWithoutNullStreams>(observer => {
    const child = spawn('gj');
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
