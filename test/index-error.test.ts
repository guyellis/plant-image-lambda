// eslint-disable-next-line import/no-unresolved
import { Context } from 'aws-lambda';
import { fakeEvent, mockLogger } from './helper';
import { pipeline } from '../src/outer';
import { handler } from '../src';

// jest.mock('gm', () => ({
//   subClass: () => new MockGM(),
// }));

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
        expect(mockLogger.error).toHaveBeenCalledTimes(1);

        // 2 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(6);
        end();
      },
    } as Context;

    handler(fakeEvent, ctx);
  });
});
