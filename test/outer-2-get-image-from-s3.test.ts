export {}; // To get around: Cannot redeclare block-scoped variable 'mockLogger'.ts(2451)

const { mockLogger } = require('./helper');
const getImageFromS3 = require('../src/outer-2-get-image-from-s3');

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

    const req = {
      deps: {
        s3: {
          getObject(obj: any, cb: Function) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            cb(null, fakeS3Object);
          },
        },
        logger: mockLogger,
      },
      data: {
        bucketName: fakeBucket,
        key: fakeKey,
      },
    };

    const actual = await getImageFromS3(req);
    expect(actual.data).toEqual(expected);
  });

  test('should throw if s3.getObject has error', async () => {
    const req = {
      deps: {
        s3: {
          getObject(obj: any, cb: Function) {
            expect(fakeBucket).toBe(obj.Bucket);
            expect(fakeKey).toBe(obj.Key);
            cb('fake-s3-getObject-error');
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
      await getImageFromS3(req);
    } catch (err) {
      expect(err).toEqual('fake-s3-getObject-error');
    }

    expect(mockLogger.timeEnd.error).toHaveBeenCalledTimes(1);
    expect.assertions(4);
  });
});
