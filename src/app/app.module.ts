import {
import { writeFile, readFileSync, exists } from 'fs';
import { promisify } from 'util';
import { includes, nextOrDefault } from '../helpers/args-extractors';
import { VoyagerModule } from '@gapi/voyager';
import { getConfig } from '../helpers/set-config';
import { basicTemplate } from '../helpers/basic.template';
import { MakeAdvancedSchema } from '../helpers/advanced-schema';
import { MakeBasicSchema } from '../helpers/basic-schema';
import { join } from 'path';
import {
import {
import { deep } from '../helpers/traverse/test';
import { traverseMap } from '../helpers/traverse-map';
import { watchBundles } from '../helpers/watch-bundles';
import { isGapiInstalled } from '../helpers/is-runner-installed';
import { ClientModule } from './client/client.module';
  Module,
  SCHEMA_OVERRIDE,
  GraphQLSchema,
  printSchema,
  buildSchema,
  mergeSchemas,
  Container,
  GRAPHQL_PLUGIN_CONFIG,
  GraphQLDirective
} from '@gapi/core';
  TypesToken,
  Config,
  IsBundlerInstalled
} from './app.tokens';
  TranspileAndLoad,
  TranspileAndGetAll
} from '../helpers/transpile-and-load';


@Module({
  imports: [VoyagerModule.forRoot(), ClientModule],
  providers: [
    {
      provide: TypesToken,
      useValue: new Map()
    },
    {
      provide: IsBundlerInstalled,
      useValue: { parcel: false, gapi: false }
    },
    {
      provide: SCHEMA_OVERRIDE,
      useFactory: () => (schema: GraphQLSchema) => {
        let externalSchema;
        try {
          const config = JSON.parse(
            readFileSync(join(process.cwd(), 'gj.json'), {
              encoding: 'utf-8'
            })
          );
          config.$schema = config.$schema || nextOrDefault('--schema', false);
          if (config.$schema) {
            externalSchema = readFileSync(config.$schema, {
              encoding: 'utf-8'
            });
            externalSchema = buildSchema(externalSchema);
          }
        } catch (e) {}
        const schemas = [externalSchema, schema].filter(i => !!i);
        let mergedSchemas: GraphQLSchema;
        if (schemas.length === 1) {
          mergedSchemas = schema;
        } else {
          mergedSchemas = mergeSchemas({
            schemas
          });
        }

        if (includes('--verbose')) {
          console.log(`
Schema:
${printSchema(mergedSchemas)}
                  `);
        }

        if (process.argv.toString().includes('--generate')) {
          promisify(writeFile)('./schema.graphql', printSchema(mergedSchemas), {
            encoding: 'utf-8'
          }).then(() => {
            console.log('Schema created!');
            process.exit(0);
          });
        }
        return mergedSchemas;
      }
    },
    {
      provide: Config,
      useFactory: async () => {
        let config = await getConfig(
          nextOrDefault('--config', 'graphqj-config')
        );
        if (!config) {
          config = await getConfig('gj');
        }
        if (!config) {
          config = basicTemplate;
        }
        return config['default'] || config;
      }
    },
    {
      provide: 'Run',
      deps: [
        Config,
        GRAPHQL_PLUGIN_CONFIG,
        IsBundlerInstalled
      ],
      lazy: true,
      useFactory: async (
        config: Config,
        graphqlConfig: GRAPHQL_PLUGIN_CONFIG,
        isBundlerInstalled: IsBundlerInstalled
      ) => {
        config = await config;
        config = await deep(config)
        isBundlerInstalled.gapi = await isGapiInstalled();
        if (config.$externals) {
          const compiledPaths = await TranspileAndGetAll(
            config.$externals,
            './.gj/out'
          );
          config.$externals = compiledPaths.map(external => {
            if (external.file.includes('.ts')) {
              external.module = require(external.transpiledFile);
            } else {
              const m = require('esm')(module)(
                join(process.cwd(), external.file)
              );
              external.module = m['default'] || m;
            }
            Container.set(external.map, external.module);
            return external;
          });
        }

        let filePath = join(process.cwd(), config.$directives || '');
        let directives: GraphQLDirective[] | any[];

        if ((await promisify(exists)(filePath)) && filePath !== process.cwd()) {
          if (filePath.includes('.ts')) {
            directives = await TranspileAndLoad(
              config.$directives.replace('.', ''),
              './.gj/out'
            );
          } else {
            directives = require('esm')(module)(filePath);
          }
          graphqlConfig.directives = (await Promise.all(
            Object.keys(directives).map(d =>
              typeof directives[d] === 'function' ? directives[d]() : null
            )
          )).filter(i => !!i);
        }

        if (config.$mode === 'basic') {
          await MakeBasicSchema(config);
        }
        if (config.$mode === 'advanced') {
          await MakeAdvancedSchema(config);
        }
        if (includes('--hot-reload')) {
          config.$externals.forEach(e => traverseMap.push({parent: null, path: e.file}))
          watchBundles(traverseMap.map(f => f.path), config)
        }
        console.log(
          'You can extract this schema by running --generate command'
        );
        return true;
      }
    }
  ]
})
export class AppModule {}
