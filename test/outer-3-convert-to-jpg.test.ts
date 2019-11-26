import { mockLogger, mockGM as MockGM } from './helper';
import { convertToJpg } from '../src/outer-3-convert-to-jpg';

describe('convertToJpg', () => {
  test('should throw if toBuffer rejects', async () => {
    MockGM.prototype.toBuffer = (_: any, cb: Function) => cb('fake-toBuffer-error');
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
    // @ts-ignore
      await convertToJpg(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    // @ts-ignore
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
