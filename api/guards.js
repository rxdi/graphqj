export async function IsLogged(
  chainable$,
  payload,
  context
) {
  if (!context.user) {
    throw new Error('Unauthorized');
  }
}
