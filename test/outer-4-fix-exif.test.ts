import { mockLogger, mockGM as MockGM } from './helper';
import { fixExif } from '../src/outer-4-fix-exif';

describe('fixExif', () => {
  test('should throw if toBuffer rejects', async () => {
    MockGM.prototype.toBuffer = (_: any, cb: Function) => cb('fake-toBuffer-error');
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
      // @ts-ignore
      await fixExif(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
