import { exec } from 'child_process';
import { promisify } from 'util';

async function run(cmd: string) {
  let res: boolean;
  try {
    if ((await promisify(exec)(cmd)).stderr) {
      res = false;
    } else {
      res = true;
    }
  } catch (e) {
    res = false;
  }
  return res;
}

export async function isParcelInstalled() {
  return await run('parcel help');
}

export async function isGapiInstalled() {
  return await run('gapi daemon status');
}
