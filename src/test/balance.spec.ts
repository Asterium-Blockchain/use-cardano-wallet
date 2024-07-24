import { parseBalance } from '../utils';

describe('Batcher tests', () => {
  it('Tx building cases', () => {
    const result = parseBalance('1a94b130b6');
    expect(result).toBe('2494640310');

    const result2 = parseBalance('1b00000001dc87463b');
    expect(result2).toBe('7994820155');

    const result3 = parseBalance(
      '821a0510379ea1581cceb8a6f66d8abf778e111ffb982626e6e795d8ef15e7261ea98738d2a14d4d61727342697264733732383001'
    );

    expect(result3).toBe('84948894');
  });
});
