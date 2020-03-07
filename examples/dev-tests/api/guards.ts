import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function IsLogged(chainable$: Observable<any>, payload, context) {
  if (!context.user) {
    throw new Error('Unauthorized');
  }
}
