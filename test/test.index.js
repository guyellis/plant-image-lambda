const helper = require('./helper');

const mockS3 = {
  getObject(obj, cb) {
    cb(null, helper.fakeS3Object);
  },
  putObject(obj, cb) {
    cb();
  },
};

jest.mock('aws-sdk', () => ({
  S3: function S3() {
    return mockS3;
  },
}));

class mockGM {
  constructor() {
    return () => this;
  }

  antialias() { return this; }

  autoOrient() { return this; }

  density() { return this; }

  resize() { return this; }

  // eslint-disable-next-line class-methods-use-this
  toBuffer(type, cb) {
    cb(null, 'Fake Buffer');
  }

  size(cb) {
    cb.call(this, null, { width: 3000, height: 2000 });
  }
}

jest.mock('gm', () => ({
  // eslint-disable-next-line new-cap
  subClass: () => new mockGM(),
}));

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));

const index = require('../src');

describe('buildFromEvent', () => {
  test('should run end-to-end', (end) => {
    const ctx = {
      done(err) {
        expect(err).toBeFalsy();
        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    };

    index.handler(helper.fakeEvent, ctx);
  });
});
