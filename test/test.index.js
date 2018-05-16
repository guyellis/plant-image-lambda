

const assert = require('assert');
const helper = require('./helper');
const index = require('../src');

function GM() {
  const _this = this;
  return () => _this;
}

GM.prototype.antialias = () => this;

GM.prototype.autoOrient = () => this;

GM.prototype.density = () => this;

GM.prototype.resize = () => this;

GM.prototype.toBuffer = (type, cb) => {
  cb(null, 'Fake Buffer');
};

GM.prototype.size = (cb) => {
  cb.call(this, null, { width: 3000, height: 2000 });
};

const gm = new GM();

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
  it('should run end-to-end', (end) => {
    const ctx = {
      done(err) {
        assert(!err);
        end();
      },
    };

    index.handlerDeps(deps, helper.fakeEvent, ctx);
  });
});
