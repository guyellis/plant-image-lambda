const { mockGM, fakeEvent, mockLogger } = require('./helper');

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
      done(err) {
        expect(err.message).toBe('fake-outer-pipeline-error');
        expect(mockLogger.error).toHaveBeenCalledTimes(1);
        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(6);
        end();
      },
    };

    index.handler(fakeEvent, ctx);
  });
});
