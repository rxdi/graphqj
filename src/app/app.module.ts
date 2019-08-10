import {
  Module,
  SCHEMA_OVERRIDE,
  BootstrapService,
  GraphQLSchema,
  printSchema,
  buildSchema,
  mergeSchemas,
  Container,
  GRAPHQL_PLUGIN_CONFIG,

} from '@gapi/core';
import { writeFile, readFileSync, exists } from 'fs';
import { promisify } from 'util';
import { includes, nextOrDefault } from '../helpers/args-extractors';
import { VoyagerModule } from '@gapi/voyager';
import { getConfig } from '../helpers/set-config';
import { basicTemplate } from '../helpers/basic.template';
import { MakeAdvancedSchema } from '../helpers/advanced-schema';
import { MakeBasicSchema } from '../helpers/basic-schema';
import { join } from 'path';
import { TypesToken, ResolversToken, ArgumentsToken, Config, GuardsToken } from './app.tokens';

@Module({
  imports: [VoyagerModule.forRoot()],
  providers: [
    {
      provide: TypesToken,
      useValue: new Map()
    },
    {
      provide: ResolversToken,
      useValue: new Map()
    },
    {
      provide: ArgumentsToken,
      useValue: new Map()
    },
    {
      provide: GuardsToken,
      useValue: new Map()
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
          mergedSchemas = schema
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
        } else {
          console.log(
            'You can extract this schema by running --generate command'
          );
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
      deps: [Config, BootstrapService, TypesToken, ResolversToken, ArgumentsToken, GuardsToken, GRAPHQL_PLUGIN_CONFIG],
      lazy: true,
      useFactory: async (
        config: Config,
        bootstrap: BootstrapService,
        types: TypesToken,
        resolvers: ResolversToken,
        args: ArgumentsToken,
        guards: GuardsToken,
        graphqlConfig: GRAPHQL_PLUGIN_CONFIG,
      ) => {
        config = await config
        config.$externals.map(external => {
          const m = require('esm')(module)(join(process.cwd(), external.file));
          external.module = m['default'] || m
          Container.set(external.map, external.module);
        })

        const filePath = join(process.cwd(), config.$directives);
        if (await promisify(exists)(filePath)) {
          const directives = require('esm')(module)(filePath)
          graphqlConfig.directives = await Promise.all(Object.keys(directives).map(d => directives[d]()) as any)
          console.log(graphqlConfig)
        }

        if (config.$mode === 'basic') {
          MakeBasicSchema(config, bootstrap);
        }

        if (config.$mode === 'advanced') {
          MakeAdvancedSchema(config, bootstrap);
        }
        return true;
      }
    }
  ]
})
export class AppModule {}
