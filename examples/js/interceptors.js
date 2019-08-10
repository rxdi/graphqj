import { tap } from 'rxjs/operators';

export async function LoggerInterceptor(chainable$, context, payload, descriptor) {
  console.log('Before...');
  const now = Date.now();
  return chainable$.pipe(
    tap(() => console.log(`After... ${Date.now() - now}ms`))
  );
}
