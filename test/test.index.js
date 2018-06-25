const helper = require('./helper');

const mocks3 = {
  getObject(obj, cb) {
    cb(null, helper.fakeS3Object);
  },
  putObject(obj, cb) {
    cb();
  },
};

jest.mock('aws-sdk', () => ({
  S3: function S3() {
    return mocks3;
  },
}));

const index = require('../src');

class GM {
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

const gm = () => new GM();


const https = {
  request(options, cb) {
    cb();
    return {
      end() {},
      on() {},
      write() {},
    };
  },
};

const deps = {
  gm,
  https,
  http: https,
};

describe('buildFromEvent', () => {
  test('should run end-to-end', (end) => {
    const ctx = {
      done(err) {
        expect(err).toBeFalsy();
        end();
      },
    };

    index.handlerDeps(deps, helper.fakeEvent, ctx);
  });
});
