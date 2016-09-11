'use strict';

var assert = require('assert');
// var helper = require('./helper');
var imageFromS3 = require('../src/outer-2-get-image-from-s3');

var gm = {
  antialias: function() { return gm; },
  density: function() { return gm; }
};

var fakeBucket = 'Fake Bucket';
var fakeKey = 'Fake Key';
var fakeS3Object = 'Fake S3 Object';

var req = {
  deps: {
    s3: {
      getObject: function(obj, cb) {
        assert.equal(fakeBucket, obj.Bucket);
        assert.equal(fakeKey, obj.Key);
        cb(null, fakeS3Object);
      }
    }
  }
};

describe('getImageFromS3', function() {
  it('should get a fake image', function(done) {
    var expected = {
      bucketName: fakeBucket,
      key: fakeKey,
      s3Object: fakeS3Object
    };
    req.data = {
      bucketName: fakeBucket,
      key: fakeKey
    };
    imageFromS3.getImageFromS3(req, function(err, actual){
      assert(!err);
      assert.deepEqual(actual.data, expected);
      done();
    });
  });

});
