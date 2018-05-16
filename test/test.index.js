

const assert = require('assert');
const helper = require('./helper');
const index = require('../src');

function GM() {
  const _this = this;
  return () => _this;
}

GM.prototype.antialias = () => {
  return this;
};

GM.prototype.autoOrient = () => {
  return this;
};

GM.prototype.density = () => {
  return this;
};

GM.prototype.resize = () => {
  return this;
};

GM.prototype.toBuffer = function (type, cb) {
  cb(null, 'Fake Buffer');
};

GM.prototype.size = function (cb) {
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
