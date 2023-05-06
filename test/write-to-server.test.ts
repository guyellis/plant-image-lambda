import _ from 'lodash';

import env from '../src/env';
import { mockLogger, mockLoggerReset, makeFakeFetchResponse } from './helper';
import { writeToServer } from '../src/write-to-server';
import { ImageSizeResponse } from '../src/outer-5-image-size';

let status = 200;
let mockThrow = false;

global.fetch = jest.fn().mockImplementation((): Promise<Response> => {
  if (mockThrow) {
    throw new Error('fake-error');
  }
  return Promise.resolve(makeFakeFetchResponse(status));
});

describe('write-to-server', () => {
  beforeEach(() => {
    mockLoggerReset();
  });

  test('should log an error if fetch returns non-200', async () => {
    const req = {
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ImageSizeResponse;

    status = 400;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot(`
      {
        "headers": {},
        "ok": true,
        "redirected": false,
        "status": 400,
        "statusText": "OK",
        "type": "default",
        "url": "fake-url",
      }
    `);
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should log an error if fetch throws', async () => {
    const req = {
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ImageSizeResponse;

    mockThrow = true;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot('null');
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });

  test('should use https instead of http', async () => {
    env.PLANT_IMAGE_PORT = '443';
    const req = {
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ImageSizeResponse;

    status = 200;
    mockThrow = false;

    const result = await writeToServer(req);

    expect(result).toMatchInlineSnapshot(`
      {
        "headers": {},
        "ok": true,
        "redirected": false,
        "status": 200,
        "statusText": "OK",
        "type": "default",
        "url": "fake-url",
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
    const req = {
      data: {
        s3Object: {
          Metadata: 'fake-metadata',
        },
        sizes: 'fake-sizes',
      },
      deps: {
        logger,
      },
    } as unknown as ImageSizeResponse;

    status = 200;
    mockThrow = false;

    const result = await writeToServer(req);
    const logTraceMock = logger.trace as jest.Mock;
    expect(result).toMatchInlineSnapshot(`
      {
        "headers": {},
        "ok": true,
        "redirected": false,
        "status": 200,
        "statusText": "OK",
        "type": "default",
        "url": "fake-url",
      }
    `);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logTraceMock.mock.calls[0]).toMatchSnapshot();
  });
});
