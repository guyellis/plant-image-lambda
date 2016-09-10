'use strict';

var assert = require('assert');
// var helper = require('./helper');
var proxyquire = require('proxyquire');

var gm = {
  antialias: function() { return gm; },
  density: function() { return gm; }
};

var fakeBucket = 'Fake Bucket';
var fakeKey = 'Fake Key';
var fakeS3Object = 'Fake S3 Object';

var imageFromS3 = proxyquire('../src/outer-2-get-image-from-s3', {
  'aws-sdk': {
    S3: function() {
      return {
        getObject: function(obj, cb) {
          assert.equal(fakeBucket, obj.Bucket);
          assert.equal(fakeKey, obj.Key);
          cb(null, fakeS3Object);
        }
      };
    }
  }
});

describe('getImageFromS3', function() {
  it('should get a fake image', function(done) {
    var expected = {
      bucketName: fakeBucket,
      key: fakeKey,
      s3Object: fakeS3Object
    };

    imageFromS3.getImageFromS3({
      bucketName: fakeBucket,
      key: fakeKey
    }, function(err, actual){
      assert(!err);
      assert.deepEqual(actual, expected);
      done();
    });
  });

});
