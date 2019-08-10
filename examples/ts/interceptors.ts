import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export async function LoggerInterceptor(
  chainable$: Observable<any>,
  context,
  payload,
  descriptor
) {
  console.log('Before...');
  const now = Date.now();
  return chainable$.pipe(
    tap(() => console.log(`After... ${Date.now() - now}ms`))
  );
}
