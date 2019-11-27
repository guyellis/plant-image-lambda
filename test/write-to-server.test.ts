import _ from 'lodash';

import env from '../src/env';
import { mockLogger, mockLoggerReset } from './helper';
import { writeToServer } from '../src/write-to-server';

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
    const req = {
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    };

    mockFetchResult.status = 400;
    // @ts-ignore
    const result = await writeToServer(req);

    expect(result).toBe(req);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should log an error if node-fetch throw', async () => {
    const req = {
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    };

    mockThrow = true;

    // @ts-ignore
    const result = await writeToServer(req);

    expect(result).toBe(req);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should use https instead of http', async () => {
    env.PLANT_IMAGE_PORT = '443';
    const req = {
      deps: {
        logger: mockLogger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    };

    mockFetchResult.status = 200;
    mockThrow = false;

    // @ts-ignore
    const result = await writeToServer(req);

    expect(result).toBe(req);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  test('should send trackId if on presets', async () => {
    const logger = _.clone(mockLogger);
    logger.presets = {
      trackId: 'fake-track-id',
    };
    env.PLANT_IMAGE_PORT = '443';
    const req = {
      deps: {
        logger,
      },
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
    };

    mockFetchResult.status = 200;
    mockThrow = false;

    // @ts-ignore
    const result = await writeToServer(req);
    const logTraceMock = logger.trace as jest.Mock;
    expect(result).toBe(req);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logTraceMock.mock.calls[0]).toMatchSnapshot();
  });
});
