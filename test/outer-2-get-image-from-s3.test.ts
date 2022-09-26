import { GetObjectRequest } from 'aws-sdk/clients/s3';
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
      data: {
        bucketName: fakeBucket,
        key: fakeKey,
      },
      deps: {
        logger: mockLogger,
        s3: {
          getObject(obj: GetObjectRequest) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            return {
              promise: () => Promise.resolve(fakeS3Object),
            };
          },
        },
      },
    } as unknown as ExtractFromEventResponse;

    const actual = await getImageFromS3(req);
    expect(actual.data).toEqual(expected);
  });

  test('should throw if s3.getObject has error', async () => {
    const req = {
      data: {
        bucketName: fakeBucket,
        key: fakeKey,
      },
      deps: {
        logger: mockLogger,
        s3: {
          getObject(obj: GetObjectRequest) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            return {
              promise: (): Promise<void> => Promise.reject('fake-s3-getObject-error'),
            };
          },
        },
      },
    } as unknown as ExtractFromEventResponse;

    await expect(() => getImageFromS3(req)).rejects.toMatchInlineSnapshot(
      '[Error: fake-s3-getObject-error]',
    );

    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(2);
    expect.assertions(4);
  });
});
