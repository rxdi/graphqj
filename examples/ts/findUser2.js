import { of } from 'rxjs';

export async function findUser2() {
  return of({
    name: 'dada',
    email: 'dada',
    phone: 13131,
    arrayOfNumbers: [111, 222],
    arrayOfStrings: ['dada', 'dada']
  });
}
