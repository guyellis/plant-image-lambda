
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

const writeToServer = require('../src/write-to-server');

describe('write-to-server', () => {
  beforeEach(() => {
    global.loggerMockReset();
  });

  test('should log an error if node-fetch returns non-200', async () => {
    const req = {
      deps: {
        logger: global.loggerMock,
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
    expect(global.loggerMock.error).toHaveBeenCalledTimes(1);
  });

  test('should log an error if node-fetch throw', async () => {
    const req = {
      deps: {
        logger: global.loggerMock,
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
    expect(global.loggerMock.error).toHaveBeenCalledTimes(1);
  });
});
