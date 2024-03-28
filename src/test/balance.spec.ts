import { parseBalance } from '../utils';

describe('Balance', () => {
  it('Parses correctlyl', () => {
    const result = parseBalance('1a94b130b6');
    expect(result).toBe('2494640310');
  });
});
