import { Sharp } from 'sharp';
import {
  mockLogger, mockS3, mockLoggerReset,
  fakeS3 as s3,
  fakeSharpJpegError as sharp,
  // fakeInput as input,
} from './helper';

import { innerPipeline } from '../src/inner';
import { ImageSizeResponse } from '../src/outer-5-image-size';

describe('innerPipeline', () => {
  beforeEach(() => {
    mockLoggerReset();
    // MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb(null, 'fake-buffer');
  });

  test('should throw if processImage throws', async () => {
    // MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb('fake-toBuffer-error');
    // const gm = new MockGM();

    const resizeSharp = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toBuffer: () => {},
    };
    const req: ImageSizeResponse = {
      buffer: Buffer.from(''),
      event: {},
      // input,
      item: {
        size: {
          name: 'fake item size',
          width: 500,
          height: 500,
        },
      },
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }, { width: 1000 }],
        imageSize: {
          width: 1200,
        },
        jpeg: {
          resize: () => resizeSharp,
        },
      },
      deps: {
        logger: mockLogger,
        sharp,
        s3,
      },
      step: 1,
    } as unknown as ImageSizeResponse;

    // eslint-disable-next-line prefer-promise-reject-errors
    resizeSharp.toBuffer = () => Promise.reject('fake-toBuffer-error') as unknown as Sharp;

    try {
      await innerPipeline(req);
    } catch (err) {
      expect(err).toEqual('fake-toBuffer-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(1);
    expect.assertions(3);
  });

  test('should skip image processing if width is target width', async () => {
    // const gm = new MockGM();

    const req: ImageSizeResponse = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }],
        imageSize: {
          width: 500,
        },
        jpeg: {
          toBuffer: () => 'fake buffer',
        },
      },
      deps: {
        logger: mockLogger,
        s3: mockS3,
      },
    } as unknown as ImageSizeResponse;

    await innerPipeline(req);

    expect(mockLogger.error).not.toHaveBeenCalledTimes(1);
    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(2);
    expect.assertions(2);
  });

  test('should throw if uploadImage throws', async () => {
    const req: ImageSizeResponse = {
      data: {
        buffer: 'fake-buffer',
        sizes: [{ width: 500 }, { width: 1000 }],
        imageSize: {
          width: 1200,
        },
        jpeg: {
          resize: () => ({
            toBuffer: () => 'fake buffer',
          }),
        },
      },
      deps: {
        logger: mockLogger,
        s3: {
          putObject() {
            return {
              // eslint-disable-next-line prefer-promise-reject-errors
              promise: () => Promise.reject('fake-putObject-error'),
            };
          },
        },
      },
    } as unknown as ImageSizeResponse;

    try {
      await innerPipeline(req);
    } catch (err) {
      expect(err).toEqual('fake-putObject-error');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(2);
    expect.assertions(3);
  });
});
