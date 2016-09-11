'use strict';

var assert = require('assert');
var helper = require('./helper');
var extractFromEvent = require('../src/outer-1-extract-from-event').extractFromEvent;

describe('extractFromEvent', function() {
  it('should build an object', function(done) {
    var req = {event: helper.fakeEvent};
    var expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg',
      outKeyRoot: 'test/'
    };

    extractFromEvent(req, function(err, actual){
      assert(!err);
      assert.deepEqual(actual.data, expected);
      done();
    });
  });

});
