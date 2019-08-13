import { BootstrapService, Container } from '@gapi/core';

export function getMutationFields() {
  return Container.get(BootstrapService)
    .schema.getMutationType()
    .getFields();
}
