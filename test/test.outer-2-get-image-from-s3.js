
const getImageFromS3 = require('../src/outer-2-get-image-from-s3');

const gm = {
  antialias() { return gm; },
  density() { return gm; },
};

const fakeBucket = 'Fake Bucket';
const fakeKey = 'Fake Key';
const fakeS3Object = 'Fake S3 Object';

const req = {
  deps: {
    s3: {
      getObject(obj, cb) {
        expect(fakeBucket).toBe(obj.Bucket);
        expect(fakeKey).toBe(obj.Key);
        cb(null, fakeS3Object);
      },
    },
    logger: {
      error: jest.fn(),
      trace: jest.fn(),
      time: jest.fn(),
      timeEnd: jest.fn(),
    },
  },
};

describe('getImageFromS3', () => {
  test('should get a fake image', async () => {
    const expected = {
      bucketName: fakeBucket,
      key: fakeKey,
      s3Object: fakeS3Object,
    };
    req.data = {
      bucketName: fakeBucket,
      key: fakeKey,
    };
    const actual = await getImageFromS3(req);
    expect(actual.data).toEqual(expected);
  });
});
