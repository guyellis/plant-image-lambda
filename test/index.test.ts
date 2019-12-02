// eslint-disable-next-line import/no-unresolved
import { Context } from 'aws-lambda';

import { mockGM, fakeEvent } from './helper';

import * as index from '../src';

jest.mock('gm', () => ({
  // eslint-disable-next-line new-cap
  subClass: () => new mockGM(),
}));

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));


describe('index-handler', () => {
  test('should run end-to-end', (end) => {
    delete process.env.LALOG_LEVEL;
    const ctx: Context = {
      done(err: Error|null) {
        expect(err).toBeFalsy();
        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    } as Context;

    index.handler(fakeEvent, ctx);
  });
});
