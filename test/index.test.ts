export {}; // To get around: Cannot redeclare block-scoped variable 'mockLogger'.ts(2451)

const { mockGM, fakeEvent } = require('./helper'); // eslint-disable-line import/no-unresolved

jest.mock('gm', () => ({
  // eslint-disable-next-line new-cap
  subClass: () => new mockGM(),
}));

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));

const index = require('../src');

describe('index-handler', () => {
  test('should run end-to-end', (end) => {
    const ctx = {
      done(err: any) {
        expect(err).toBeFalsy();
        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    };

    index.handler(fakeEvent, ctx);
  });
});
