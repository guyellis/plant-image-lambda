// eslint-disable-next-line import/no-unresolved
import { Context } from 'aws-lambda';
import { mockGM as MockGM, fakeEvent /* , mockLogger */ } from './helper';
import { pipeline } from '../src/outer';
import { handler } from '../src';

jest.mock('gm', () => ({
  subClass: () => new MockGM(),
}));

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));

jest.mock('../src/outer');
const pipelineMock = pipeline as jest.Mock;

pipelineMock.mockRejectedValue('fake-outer-pipeline-error');

describe('index-handler-error', () => {
  test('should log error if pipeline throws', (end) => {
    const ctx: Context = {
      done(err: Error|null) {
        expect(err).toBe('fake-outer-pipeline-error');

        // TODO: The expect() below should work. When stepping through with
        // the debugger this logger.error() method is hit but for some reason
        // the mockLogger does not appear to have been substituted properly.
        // Fix this - perhaps coming up with another way to mock the logger.
        // expect(mockLogger.error).toHaveBeenCalledTimes(1);

        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    } as Context;

    handler(fakeEvent, ctx);
  });
});
