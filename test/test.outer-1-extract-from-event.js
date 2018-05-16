

const assert = require('assert');
const helper = require('./helper');
const { extractFromEvent } = require('../src/outer-1-extract-from-event');

describe('extractFromEvent', () => {
  test('should build an object', (done) => {
    const req = { event: helper.fakeEvent };
    const expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg',
      outKeyRoot: 'test/',
    };

    extractFromEvent(req, (err, actual) => {
      assert(!err);
      assert.deepEqual(actual.data, expected);
      done();
    });
  });
});
