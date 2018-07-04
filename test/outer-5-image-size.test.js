const { mockLogger, mockGM: MockGM } = require('./helper');
const getImageSize = require('../src/outer-5-image-size');

describe('getImageSize', () => {
  test('should throw if size rejects', async () => {
    MockGM.prototype.size = cb => cb('fake-size-error');
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
      },
      deps: {
        gm,
        logger: mockLogger,
      },
    };

    try {
      await getImageSize(req);
    } catch (err) {
      expect(err).toEqual('fake-size-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
