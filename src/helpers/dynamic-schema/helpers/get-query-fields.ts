import { BootstrapService, Container } from '@gapi/core';

export function getQueryFields() {
  return Container.get(BootstrapService)
    .schema.getQueryType()
    .getFields();
}
