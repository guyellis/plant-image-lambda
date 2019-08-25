const mockFetchResult = {
  status: 200,
};

let mockThrow = false;

jest.mock('node-fetch', () => (() => {
  if (mockThrow) {
    throw new Error('fake-error');
  }
  return mockFetchResult;
}));

const env = require('../src/env'); // eslint-disable-line import/no-unresolved

const { mockLogger, mockLoggerReset } = require('./helper');
const writeToServer = require('../src/write-to-server');

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

    const result = await writeToServer(req);

    expect(result).toBe(req);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });
});
