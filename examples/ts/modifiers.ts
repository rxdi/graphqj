import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export async function OnlyAdmin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainable$: Observable<any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptor,
) {
  return chainable$.pipe(map(() => null));
}
