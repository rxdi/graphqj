import { exists, readFile, readFileSync, stat, Stats, unlink, writeFile } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { promisify } from 'util';

import { TranspileTypescript } from './typescript.builder';

export async function getConfig(configFilename: string) {
  let config;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config = require('esm')(module)(join(process.cwd(), `${configFilename}.js`));
    // console.log('JS Config', config)
  } catch (e) {}
  if (await promisify(exists)(`./${configFilename}.yml`)) {
    const file = readFileSync(`./${configFilename}.yml`, { encoding: 'utf-8' });
    config = load(file);
    // console.log('YML Config', config)
  }
  if (await promisify(exists)(`./${configFilename}.ts`)) {
    // console.log('Typescript Config', config)
    const isMigrateTempConfigExists = await promisify(exists)('./.gj/config.temp');
    const TranspileAndWriteTemp = async (stats: Stats) => {
      await TranspileTypescript([`/${configFilename}.ts`], './.gj');
      // console.log('Transpile complete!');
      await promisify(writeFile)('./.gj/config.temp', stats.mtime.toISOString(), { encoding: 'utf-8' });
    };
    const stats = await promisify(stat)(`./${configFilename}.ts`);
    if (isMigrateTempConfigExists) {
      const temp = await promisify(readFile)('./.gj/config.temp', {
        encoding: 'utf-8',
      });
      if (new Date(temp).toISOString() !== stats.mtime.toISOString()) {
        // console.log(`${configFilename} configuration is new transpiling...`);
        await TranspileAndWriteTemp(stats);
      }
    } else {
      // console.log(`Transpile ${configFilename}.ts...`);
      await TranspileAndWriteTemp(stats);
    }
    config = require(join(process.cwd(), `./.gj`, `${configFilename}.js`));

    try {
      await promisify(unlink)(join('./.gj', `${configFilename}.js.map`));
    } catch (e) {}
  }
  try {
    config = JSON.parse(
      await promisify(readFile)(join(process.cwd(), `${configFilename}.json`), {
        encoding: 'utf-8',
      }),
    );
    // console.log('Json Config', config)
  } catch (e) {}

  return config;
}
