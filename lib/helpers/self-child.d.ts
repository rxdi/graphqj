/// <reference types="node" />
import { ChildProcessWithoutNullStreams } from 'child_process';
import { Observable } from 'rxjs';
export declare const SelfChild: (configFile: string) => Observable<ChildProcessWithoutNullStreams>;
