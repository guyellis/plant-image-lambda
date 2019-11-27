import _ from 'lodash';

import env from '../src/env';
import { mockLogger, mockLoggerReset } from './helper';
import { writeToServer } from '../src/write-to-server';
import { ImageSizeResponse } from '../src/outer-5-image-size';

const mockFetchResult = {
  status: 200,
};

let mockThrow = false;

jest.mock('node-fetch', () => () => {
  if (mockThrow) {
    throw new Error('fake-error');
  }
  return mockFetchResult;
});

describe('write-to-server', () => {
  beforeEach(() => {
    mockLoggerReset();
  });

  test('should log an error if node-fetch returns non-200', async () => {
    const req = ({
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    } as unknown) as ImageSizeResponse;

    mockFetchResult.status = 400;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "status": 400,
      }
    `);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should log an error if node-fetch throw', async () => {
    const req = ({
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    } as unknown) as ImageSizeResponse;

    mockThrow = true;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot('null');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should use https instead of http', async () => {
    env.PLANT_IMAGE_PORT = '443';
    const req = ({
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    } as unknown) as ImageSizeResponse;

    mockFetchResult.status = 200;
    mockThrow = false;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot(`
      Object {
        "status": 200,
      }
    `);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  test('should send trackId if on presets', async () => {
    const logger = _.clone(mockLogger);
    logger.presets = {
      trackId: 'fake-track-id',
    };
    env.PLANT_IMAGE_PORT = '443';
    const req = ({
      deps: {
        logger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    } as unknown) as ImageSizeResponse;

    mockFetchResult.status = 200;
    mockThrow = false;

    const result = await writeToServer(req);
    const logTraceMock = logger.trace as jest.Mock;
    expect(result).toMatchInlineSnapshot(`
      Object {
        "status": 200,
      }
    `);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logTraceMock.mock.calls[0]).toMatchSnapshot();
  });
});
