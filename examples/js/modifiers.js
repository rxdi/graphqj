import { map } from 'rxjs/operators';

export async function OnlyAdmin(chainable$, context, payload, descriptor) {
  return chainable$.pipe(map(() => null));
}
