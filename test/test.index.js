const helper = require('./helper');
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

const s3 = {
  getObject(obj, cb) {
    cb(null, helper.fakeS3Object);
  },
  putObject(obj, cb) {
    cb();
  },
};

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
  s3,
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
