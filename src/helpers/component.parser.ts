import { promisify } from 'util';
import { exists } from 'fs';
import { join, basename } from 'path';
import { ConfigViews, PredictedTranspilation } from '../app/app.tokens';
import {
  TranspileTypescript,
  TranspileTypescriptParcel
} from './typescript.builder';


export async function transpileComponent(path: string = ''): Promise<PredictedTranspilation> {
  if (!path || path && !path.includes('💉')) {
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
    newPath: join(
      process.cwd(),
      'components',
      path.replace(basename(path), '')
    ),
    link: `http://0.0.0.0:9000/components/${basename(path).replace('ts', 'js')}`
  };
}
export async function mapComponentsPath(views: ConfigViews) {
  return (await Promise.all(
    []
      .concat(...Object.keys(views).map(v => views[v].components))
      .filter(i => !!i)
      .map(c => transpileComponent(c))
  )).filter(i => !!i);
}

export function modifyViewsConfig(
  views: ConfigViews,
  components: { originalPath: string; link: string }[]
) {
  Object.keys(views).forEach(v => {
    if (!views[v].components) {
      return;
    }
    views[v].components = views[v].components.map(c => {
      const exists = components.find(p => p.originalPath === c);
      if (exists) {
        return exists.link;
      }
      return c;
    });
  });
  return views;
}
export async function transpileComponentsForViews(views: ConfigViews) {
  const components = await mapComponentsPath(views);
  for (const { transpilerPath } of components) {
    await TranspileTypescriptParcel(
        [transpilerPath],
        join(process.cwd(), 'components')
      );
  }
  modifyViewsConfig(views, components);
  return views;
}


export async function predictConfig(components: string[]) {
  return Promise.all(components.map(async c => (await transpileComponent(c))))
}

export async function transpileComponentsInit(components: string[]) {
  const config = await predictConfig(components);
  for (const predictedConfig of config) {
    await TranspileTypescriptParcel(
      [predictedConfig.transpilerPath],
      join(process.cwd(), 'components')
    );
  }
  return config;
}
