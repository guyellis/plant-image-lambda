import { fakeEvent, mockLogger } from './helper';
import { pipeline } from '../src/outer';
import { handler } from '../src';

jest.mock('node-fetch', () => (): { status: number; } => ({
  status: 200,
}));

jest.mock('../src/outer');
const pipelineMock = pipeline as jest.Mock;

pipelineMock.mockRejectedValue(new Error('fake-outer-pipeline-error'));

describe('index-handler-error', () => {
  test('should log error if pipeline throws', async () => {
    await expect(() => handler(fakeEvent)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"fake-outer-pipeline-error"',
    );
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });
});
