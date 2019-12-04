import { mockLogger } from './helper';
import { convertToJpg } from '../src/outer-3-convert-to-jpg';
import { GetImageFromS3Response } from '../src/outer-2-get-image-from-s3';

describe('convertToJpg', () => {
  test('should throw if toBuffer rejects', async () => {
    // MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb('fake-toBuffer-error');
    // const gm = new MockGM();

    const req = {
      data: {
        s3Object: {
        },
      },
      deps: {
        // eslint-disable-next-line prefer-promise-reject-errors
        sharp: () => ({ jpeg: () => Promise.reject('fake-jpeg-error') }),
        logger: mockLogger,
      },
    } as unknown as GetImageFromS3Response;

    try {
      await convertToJpg(req);
    } catch (err) {
      expect(err).toEqual('fake-jpeg-error');
    }

    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
