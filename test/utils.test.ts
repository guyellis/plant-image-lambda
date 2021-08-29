import { getError } from '../src/utils';

describe('utils', () => {
  test('gets Error object if receives error object', () => {
    expect(getError(new Error('example error'))).toMatchInlineSnapshot(
      '[Error: example error]',
    );
  });
  
  test('gets undefined if receives non-string/Error', () => {
    expect(getError(undefined)).toMatchInlineSnapshot('undefined');
  });

  test('gets Error object if receives a string', () => {
    expect(getError('example error')).toMatchInlineSnapshot(
      '[Error: example error]',
    );
  });
});
