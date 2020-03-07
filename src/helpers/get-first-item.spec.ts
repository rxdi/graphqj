import 'jest';

import { getFirstItem } from './get-first-item';

describe('Get first item from Object', () => {
  it('should get first item of object without recursion', async () => {
    expect(getFirstItem({ test1: 1, test2: 2, test3: {} })).toBe(1);
  });
});
