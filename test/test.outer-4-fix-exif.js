const { mockLogger, mockGM: MockGM } = require('./helper');
const fixExif = require('../src/outer-4-fix-exif');

describe('fixExif', () => {
  test('should throw if toBuffer rejects', async () => {
    MockGM.prototype.toBuffer = (imageType, cb) => cb('fake-toBuffer-error');
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
      await fixExif(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
