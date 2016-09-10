'use strict';

var assert = require('assert');
var index = require('..');
var helper = require('./helper');

describe('buildFromEvent', function() {
  it('should build an object', function() {
    var event = helper.fakeEvent;
    var actual = index.extractFromEvent(event);
    var expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg'
    };
    assert.deepEqual(actual, expected);
  });
});
