import { PutObjectRequest } from 'aws-sdk/clients/s3';
import {
  mockLogger, mockGM as MockGM, mockS3, mockLoggerReset,
} from './helper';

import { innerPipeline } from '../src/inner';
import { ImageSizeResponse } from '../src/outer-5-image-size';

describe('innerPipeline', () => {
  beforeEach(() => {
    mockLoggerReset();
    MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb(null, 'fake-buffer');
  });

  test('should throw if processImage throws', async () => {
    MockGM.prototype.toBuffer = (_: any, cb: Function): void => cb('fake-toBuffer-error');
    const gm = new MockGM();

    const req: ImageSizeResponse = {
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
    } as unknown as ImageSizeResponse;

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
    const gm = new MockGM();

    const req: ImageSizeResponse = {
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
    } as unknown as ImageSizeResponse;

    await innerPipeline(req);

    expect(mockLogger.error).not.toHaveBeenCalledTimes(1);
    expect(mockLogger.timeEnd).toHaveBeenCalledTimes(2);
    expect.assertions(2);
  });

  test('should throw if uploadImage throws', async () => {
    const gm = new MockGM();

    const req: ImageSizeResponse = {
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
          putObject(_: PutObjectRequest, cb: Function) {
            cb('fake-putObject-error');
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
