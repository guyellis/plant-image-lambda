import { mockLogger } from './helper';
import { getImageSize } from '../src/outer-5-image-size';
import { ConvertToJpgResponse } from '../src/outer-3-convert-to-jpg';

describe('getImageSize', () => {
  test('should throw if size rejects', async () => {
    const req = {
      data: {
        buffer: 'fake-buffer',
        jpeg: {
          // eslint-disable-next-line prefer-promise-reject-errors
          metadata: () => Promise.reject('fake-size-error'),
        },
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ConvertToJpgResponse;

    try {
      await getImageSize(req);
    } catch (err) {
      expect(err).toEqual('fake-size-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
