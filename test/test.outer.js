'use strict';

const assert = require('assert');
const helper = require('./helper');
const index = require('../src/outer');

describe('buildFromEvent', () => {
  it.skip('should run outer end-to-end', (end) => {
    const ctx = {
      done(err) {
        assert(!err);
        end();
      },
    };

    index.handler(helper.fakeEvent, ctx);
  });
});
