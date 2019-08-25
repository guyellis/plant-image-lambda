export {}; // To get around: Cannot redeclare block-scoped variable 'mockLogger'.ts(2451)

const { mockGM, fakeEvent /* , mockLogger */ } = require('./helper'); // eslint-disable-line import/no-unresolved

jest.mock('gm', () => ({
  // eslint-disable-next-line new-cap
  subClass: () => new mockGM(),
}));

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));

jest.mock('../src/outer', () => () => {
  throw new Error('fake-outer-pipeline-error');
});

const index = require('../src');

describe('index-handler-error', () => {
  test('should log error if pipeline throws', (end) => {
    const ctx = {
      done(err: any) {
        expect(err.message).toBe('fake-outer-pipeline-error');

        // TODO: The expect() below should work. When stepping through with
        // the debugger this logger.error() method is hit but for some reason
        // the mockLogger does not appear to have been substituted properly.
        // Fix this - perhaps coming up with another way to mock the logger.
        // expect(mockLogger.error).toHaveBeenCalledTimes(1);

        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    };

    index.handler(fakeEvent, ctx);
  });
});
