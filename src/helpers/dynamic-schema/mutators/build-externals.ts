import { Container } from '@rxdi/core';
import { join } from 'path';

import { Config } from '../../../app/app.tokens';
import { TranspileAndGetAll } from '../../transpile-and-load';

export async function buildExternals(config: Config) {
  const compiledPaths = await TranspileAndGetAll(config.$externals, './.gj/out');
  config.$externals = compiledPaths.map(external => {
    if (external.file.includes('.ts')) {
      external.module = require(external.transpiledFile);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require('esm')(module)(join(process.cwd(), external.file));
      external.module = m['default'] || m;
    }
    Container.reset(external.map);
    Container.remove(external.map);
    Container.set(external.map, external.module);
    return external;
  });
  return config.$externals;
}
