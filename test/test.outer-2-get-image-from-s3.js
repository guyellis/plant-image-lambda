

const assert = require('assert');
// var helper = require('./helper');
const imageFromS3 = require('../src/outer-2-get-image-from-s3');

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
        assert.equal(fakeBucket, obj.Bucket);
        assert.equal(fakeKey, obj.Key);
        cb(null, fakeS3Object);
      },
    },
  },
};

describe('getImageFromS3', () => {
  test('should get a fake image', (done) => {
    const expected = {
      bucketName: fakeBucket,
      key: fakeKey,
      s3Object: fakeS3Object,
    };
    req.data = {
      bucketName: fakeBucket,
      key: fakeKey,
    };
    imageFromS3.getImageFromS3(req, (err, actual) => {
      assert(!err);
      assert.deepEqual(actual.data, expected);
      done();
    });
  });
});
