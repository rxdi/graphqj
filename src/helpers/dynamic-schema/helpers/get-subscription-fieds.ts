import { BootstrapService, Container } from '@gapi/core';

export function getSubscriptionFields() {
  return Container.get(BootstrapService)
    .schema.getSubscriptionType()
    .getFields();
}
