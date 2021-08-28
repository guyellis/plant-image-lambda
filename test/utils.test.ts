import { getError } from '../src/utils';

describe('utils', () => {
  test('gets Error object', () => {
    expect(getError(new Error('example error'))).toMatchInlineSnapshot(
      '[Error: example error]',
    );
  });
  test('gets undefined', () => {
    expect(getError('example error')).toMatchInlineSnapshot('undefined');
  });
});
