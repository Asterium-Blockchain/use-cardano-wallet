import { parseBalance } from '../utils';

describe('Batcher tests', () => {
  it('Tx building cases', () => {
    const result = parseBalance('1a94b130b6');
    expect(result).toBe('2494640310');

    const result2 = parseBalance('1b00000001dc87463b');
    expect(result2).toBe('7994820155');
  });
});
