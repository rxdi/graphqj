import { GraphQLSchema } from 'graphql';
import { BootstrapService } from '@gapi/core';
import { Config } from '../app/app.tokens';
export declare function MakeAdvancedSchema(config: Config, bootstrap: BootstrapService): Promise<GraphQLSchema>;
