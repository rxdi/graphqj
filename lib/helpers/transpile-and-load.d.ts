import { Externals } from '../app/app.tokens';
export declare function TranspileAndLoad(path: string, outDir: string): Promise<any>;
export declare function TranspileAndGetAll(externals: Externals[], outDir: string): Promise<{
    transpiledFile: string;
    map: string;
    file: string;
    module?: any;
}[]>;
