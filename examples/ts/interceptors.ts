import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export async function LoggerInterceptor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chainable$: Observable<any>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  payload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptor,
) {
  console.log('Before...');
  const now = Date.now();
  return chainable$.pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
}
