import { of } from 'rxjs';

export async function findUser() {
  console.log("OMG222")
  return {
    name: 'dada',
    email: 'dada',
    phone: 13131,
    arrayOfNumbers: [111, 222],
    arrayOfStrings: ['dada', 'dada']
  };
}
