import { exists } from 'fs';
import { basename, join } from 'path';
import { IComponentsType } from 'src/app/@introspection';
import { promisify } from 'util';

import { IConfigViews, IPredictedTranspilation } from '../app/app.tokens';
import { TranspileTypescriptParcel } from './typescript.builder';

export async function transpileComponent(path = ''): Promise<IPredictedTranspilation> {
  if (!path || (path && !path.includes('💉'))) {
    return;
  }
  const originalPath = `${path}`;
  path = path.replace('💉', '');
  let filePath = join(process.cwd(), path);
  let transpilerPath: string = filePath;
  filePath = join(process.cwd(), 'node_modules', path);
  if (await promisify(exists)(filePath)) {
    transpilerPath = `./node_modules/${path}`;
  }
  return {
    originalPath,
    filePath,
    transpilerPath,
    newPath: join(process.cwd(), 'components', path.replace(basename(path), '')),
    link: `http://0.0.0.0:9000/components/${basename(path).replace('ts', 'js')}`,
  };
}
export async function mapComponentsPath(views: IConfigViews) {
  return (
    await Promise.all(
      []
        .concat(...Object.keys(views).map(v => views[v].components))
        .filter(i => !!i)
        .map(c => transpileComponent(c.link)),
    )
  ).filter(i => !!i);
}

export function modifyViewsConfig(views: IConfigViews, components: { originalPath: string; link: string }[]) {
  Object.keys(views).forEach(v => {
    if (!views[v].components) {
      return;
    }
    views[v].components = views[v].components.map(c => {
      const exists = components.find(p => p.originalPath === c.link);
      if (exists) {
        c.link = exists.link;
        return c;
      }
      return c;
    });
  });
  return views;
}
export async function transpileComponentsForViews(views: IConfigViews) {
  const components = await mapComponentsPath(views);
  for (const { transpilerPath } of components) {
    await TranspileTypescriptParcel([transpilerPath], join(process.cwd(), 'components'));
  }
  modifyViewsConfig(views, components);
  return views;
}

export async function predictConfig(components: IComponentsType[]) {
  return Promise.all(components.map(async c => await transpileComponent(c.link)));
}

export async function transpileComponentsInit(components: IComponentsType[]) {
  const config = await predictConfig(components);
  for (const predictedConfig of config) {
    await TranspileTypescriptParcel([predictedConfig.transpilerPath], join(process.cwd(), 'components'));
  }
  return config;
}
