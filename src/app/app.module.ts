import {
  Module,
  SCHEMA_OVERRIDE,
  BootstrapService,
  GraphQLSchema,
  printSchema,
  buildSchema,
  mergeSchemas
} from '@gapi/core';
import { writeFile, readFileSync } from 'fs';
import { promisify } from 'util';
import { includes, nextOrDefault } from '../helpers/args-extractors';
import { VoyagerModule } from '@gapi/voyager';
import { getConfig } from '../helpers/set-config';
import { basicTemplate } from '../helpers/basic.template';
import { MakeAdvancedSchema } from '../helpers/advanced-schema';
import { MakeBasicSchema } from '../helpers/basic-schema';
import { join } from 'path';

@Module({
  imports: [VoyagerModule.forRoot()],
  providers: [
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
            externalSchema = buildSchema(externalSchema)
          }
        } catch (e) {}
        const mergedSchemas = mergeSchemas({
          schemas: [externalSchema, schema].filter(i => !!i)
        });
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
      provide: 'createFields',
      deps: [BootstrapService],
      lazy: true,
      useFactory: async (bootstrap: BootstrapService) => {
        let config = await getConfig(
          nextOrDefault('--config', 'graphqj-config')
        );
        if (!config) {
          config = await getConfig('gj');
        }
        if (!config) {
          config = basicTemplate;
        }
        config = config['default'] || config;

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
