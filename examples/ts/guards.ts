import { Observable } from 'rxjs';

export async function IsLogged(
  chainable$: Observable<any>,
  payload,
  context
) {
  if (!context.user) {
    throw new Error('Unauthorized');
  }
}
