import { pxtToWei } from '../src/utils/charge';

describe('pxtToWei', () => {
  test('integer', () => {
    const pxt = 1
    expect(pxtToWei(pxt)).toBe(1000000000000000000);
  });

  test('string', () => {
    const pxt = "1"
    expect(pxtToWei(pxt)).toBe(1000000000000000000);
  });

  test('decimal', () => {
    const pxt = 0.1
    expect(pxtToWei(pxt)).toBe(100000000000000000);
  });

  test('long decimal', () => {
    const pxt = 0.1046689365421890789
    expect(pxtToWei(pxt)).toBe(104668936542189078);
  });
});
