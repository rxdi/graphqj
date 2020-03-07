import { Container } from '@rxdi/core';

import { Config, TypesToken } from '../../../app/app.tokens';
import { ParseArgs } from '../../parse-ast';

export function buildArguments(config: Config) {
  Object.keys(config.$args).forEach(reusableArgumentKey => {
    const args = {};
    Object.keys(config.$args[reusableArgumentKey]).forEach(o => {
      args[o] = ParseArgs(config.$args[reusableArgumentKey][o]);
      Container.get(TypesToken).set(reusableArgumentKey, args);
    });
  });
}
