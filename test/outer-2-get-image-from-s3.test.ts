import { mockLogger } from './helper';
import { getImageFromS3 } from '../src/outer-2-get-image-from-s3';
import { ExtractFromEventResponse } from '../src/outer-1-extract-from-event';

const fakeBucket = 'Fake Bucket';
const fakeKey = 'Fake Key';
const fakeS3Object = 'Fake S3 Object';

describe('getImageFromS3', () => {
  test('should get a fake image', async () => {
    const expected = {
      bucketName: fakeBucket,
      key: fakeKey,
      s3Object: fakeS3Object,
    };

    const req: ExtractFromEventResponse = {
      deps: {
        s3: {
          getObject(obj: any) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            return {
              promise: () => Promise.resolve(fakeS3Object),
            };
          },
        },
        logger: mockLogger,
      },
      data: {
        bucketName: fakeBucket,
        key: fakeKey,
      },
    } as unknown as ExtractFromEventResponse;

    const actual = await getImageFromS3(req);
    expect(actual.data).toEqual(expected);
  });

  test('should throw if s3.getObject has error', async () => {
    const req = {
      deps: {
        s3: {
          getObject(obj: any) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            return {
              // eslint-disable-next-line prefer-promise-reject-errors
              promise: () => Promise.reject('fake-s3-getObject-error'),
            };
          },
        },
        logger: mockLogger,
      },
      data: {
        bucketName: fakeBucket,
        key: fakeKey,
      },
    };

    try {
    // @ts-ignore
      await getImageFromS3(req);
    } catch (err) {
      expect(err).toEqual('fake-s3-getObject-error');
    }

    // @ts-ignore
    expect(mockLogger.timeEnd.error).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });
});
