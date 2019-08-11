import { traverseAndLoadConfigs } from './traverse';
import { loadFile } from '../load-file';
import { join } from 'path';
const test = []
export async function traverseObject<T>(obj: T) {
  for (let [k, v] of Object.entries(obj)) {
    if (obj.hasOwnProperty(k)) {
      if (typeof obj[k] === 'string' && obj[k].includes('💉')) {
        let res = {path: obj[k], module: null };

        obj[k] = await loadFile(join(process.cwd(), obj[k].replace('💉', '')));
        res.module = obj[k]
        test.push(res)

      }
      await traverseAndLoadConfigs(obj[k]);
    }
  }
}


setTimeout(() => {
  console.log(test)
}, 3000)