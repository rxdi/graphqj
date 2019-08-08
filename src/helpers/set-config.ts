import { promisify } from 'util';
import { exists, Stats, writeFile, stat, readFile, unlink } from 'fs';
import { TranspileTypescript } from './typescript.builder';
import { join } from 'path';

export async function getConfig(configFilename: string) {
  let config;
  try {
    config = require('esm')(module)(
      join(process.cwd(), `${configFilename}.js`)
    );
  } catch (e) {}
  if (await promisify(exists)(`./${configFilename}.ts`)) {
    const isMigrateTempConfigExists = await promisify(exists)(
      './.gj/config.temp'
    );
    const TranspileAndWriteTemp = async (stats: Stats) => {
      await TranspileTypescript([`/${configFilename}.ts`], './.gj');
      console.log('Transpile complete!');
      await promisify(writeFile)(
        './.gj/config.temp',
        stats.mtime.toISOString(),
        { encoding: 'utf-8' }
      );
    };
    const stats = await promisify(stat)(`./${configFilename}.ts`);
    if (isMigrateTempConfigExists) {
      const temp = await promisify(readFile)('./.gj/config.temp', {
        encoding: 'utf-8'
      });
      if (new Date(temp).toISOString() !== stats.mtime.toISOString()) {
        console.log(`${configFilename} configuration is new transpiling...`);
        await TranspileAndWriteTemp(stats);
      }
    } else {
      console.log(`Transpile ${configFilename}.ts...`);
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
        encoding: 'utf-8'
      })
    );
  } catch (e) {}

  return config;
}
