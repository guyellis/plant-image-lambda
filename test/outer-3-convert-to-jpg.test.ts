import { mockLogger } from './helper';
import { convertToJpg } from '../src/outer-3-convert-to-jpg';
import { GetImageFromS3Response } from '../src/outer-2-get-image-from-s3';

describe('convertToJpg', () => {
  test('should throw if toBuffer rejects', () => {
    const req = {
      data: {
        s3Object: {},
      },
      deps: {
        logger: mockLogger,
        sharp: () => ({
          jpeg: (): void => {
            throw new Error('fake-jpeg-error');
          },
        }),
      },
    } as unknown as GetImageFromS3Response;

    expect(() => convertToJpg(req)).toThrowErrorMatchingInlineSnapshot(
      '"fake-jpeg-error"',
    );

    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
