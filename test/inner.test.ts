import {
  mockLogger, mockGM as MockGM, mockS3, mockLoggerReset,
} from './helper';

const pipeline = require('../src/inner');

describe('pipeline', () => {
  beforeEach(() => {
    mockLoggerReset();
    MockGM.prototype.toBuffer = (_: any, cb: Function) => cb(null, 'fake-buffer');
  });

  test('should throw if processImage throws', async () => {
    MockGM.prototype.toBuffer = (_: any, cb: Function) => cb('fake-toBuffer-error');
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }, { width: 1000 }],
        imageSize: {
          width: 1200,
        },
      },
      deps: {
        gm,
        logger: mockLogger,
      },
    };

    try {
      await pipeline(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    // @ts-ignore TODO: Fix this
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    // @ts-ignore TODO: Fix this
    expect(mockLogger.timeEnd.error).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  test('should skip image processing if width is target width', async () => {
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }],
        imageSize: {
          width: 500,
        },
      },
      deps: {
        gm,
        logger: mockLogger,
        s3: mockS3,
      },
    };

    await pipeline(req);

    // @ts-ignore TODO: Fix this
    expect(mockLogger.error).not.toHaveBeenCalledTimes(1);
    // @ts-ignore TODO: Fix this
    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(2);
    expect.assertions(2);
  });

  test('should throw if uploadImage throws', async () => {
    const gm = new MockGM();

    const req = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }, { width: 1000 }],
        imageSize: {
          width: 1200,
        },
      },
      deps: {
        gm,
        logger: mockLogger,
        s3: {
          putObject(_: any, cb: Function) {
            cb('fake-putObject-error');
          },
        },
      },
    };

    try {
      await pipeline(req);
    } catch (err) {
      expect(err).toEqual('fake-putObject-error');
    }

    // @ts-ignore TODO: Fix this
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    // @ts-ignore TODO: Fix this
    expect(mockLogger.timeEnd.error).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });
});
