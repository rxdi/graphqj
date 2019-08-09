"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const rxjs_1 = require("rxjs");
exports.SelfChild = (configFile) => {
    return new rxjs_1.Observable(observer => {
        const args = [];
        args.push('--config');
        args.push(configFile);
        const child = child_process_1.spawn('gj', args);
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
