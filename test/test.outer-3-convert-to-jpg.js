const { mockLogger, mockGM: MockGM } = require('./helper');
const convertToJpg = require('../src/outer-3-convert-to-jpg');

describe('convertToJpg', () => {
  test('should throw if toBuffer rejects', async () => {
    MockGM.prototype.toBuffer = (imageType, cb) => cb('fake-toBuffer-error');
    const gm = new MockGM();

    const req = {
      data: {
        s3Object: {
        },
      },
      deps: {
        gm,
        logger: mockLogger,
      },
    };

    try {
      await convertToJpg(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
