'use strict';

var assert = require('assert');
var index = require('..');
var helper = require('./helper');

describe('buildFromEvent', function() {
  it('should build an object', function(done) {
    var event = helper.fakeEvent;
    var expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg'
    };

    index.extractFromEvent(event, function(err, actual){
      assert(!err);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
