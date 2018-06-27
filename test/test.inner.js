const { mockLogger, mockGM: MockGM } = require('./helper');
const pipeline = require('../src/inner');

describe('pipeline', () => {
  test('should throw if processImage throws', async () => {
    MockGM.prototype.toBuffer = (imageType, cb) => cb('fake-toBuffer-error');
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }, { width: 1000 }],
        imageSize: {
          width: 1200,
        },
      },
      deps: {
        gm,
        logger: mockLogger,
      },
    };

    try {
      await pipeline(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.timeEnd.error).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });
});
