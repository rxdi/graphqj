import 'jest';

import { getFirstItemIfFuncton } from './get-first-item';

describe('Get first item from Object', () => {
  it('should get first item of object without recursion', async () => {
    const test1 = () => 1;
    expect(getFirstItemIfFuncton({ test1, test2: 2, test3: {} })).toBe(test1);
  });
});
