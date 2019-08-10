import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export async function OnlyAdmin(
  chainable$: Observable<any>,
  context,
  payload,
  descriptor
) {
  return chainable$.pipe(map(() => null));
}
