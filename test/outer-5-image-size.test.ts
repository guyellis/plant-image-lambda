import { mockLogger, mockGM as MockGM } from './helper';

import { getImageSize } from '../src/outer-5-image-size';

describe('getImageSize', () => {
  test('should throw if size rejects', async () => {
    MockGM.prototype.size = (cb: Function) => cb('fake-size-error');
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
      },
      deps: {
        gm,
        logger: mockLogger,
      },
    };

    try {
      // @ts-ignore TODO: Fix this
      await getImageSize(req);
    } catch (err) {
      expect(err).toEqual('fake-size-error');
    }

    // @ts-ignore TODO: Fix this
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
