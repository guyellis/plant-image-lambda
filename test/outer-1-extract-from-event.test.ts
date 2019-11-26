import _ from 'lodash';
import { fakeEvent, mockLogger, mockLoggerReset } from './helper';

import { extractFromEvent, BasicRequest } from '../src/outer-1-extract-from-event';

describe('extractFromEvent', () => {
  beforeEach(() => {
    mockLoggerReset();
  });

  test('should build an object', async () => {
    const req: BasicRequest = {
      event: fakeEvent,
      deps: {
        logger: mockLogger,
      },
    } as BasicRequest;

    const expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg',
      outKeyRoot: 'test/',
    };

    const actual = await extractFromEvent(req);
    expect(actual.data).toEqual(expected);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  test('should log and throw if no key match', async () => {
    const req: BasicRequest = {
      event: _.cloneDeep(fakeEvent),
      deps: {
        logger: mockLogger,
      },
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'abcjjj';

    try {
      await extractFromEvent(req);
    } catch (err) {
      expect(err.message).toBe('unable to infer image type for key abcjjj');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if image type not recognized', async () => {
    const req: BasicRequest = {
      event: _.cloneDeep(fakeEvent),
      deps: {
        logger: mockLogger,
      },
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'abc.jjj';

    try {
      await extractFromEvent(req);
    } catch (err) {
      expect(err.message).toBe('skipping non-image abc.jjj');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if orig missing from key', async () => {
    const req: BasicRequest = {
      event: _.cloneDeep(fakeEvent),
      deps: {
        logger: mockLogger,
      },
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'test/bad/2016-08-27+10.20.04.jpg';

    try {
      await extractFromEvent(req);
    } catch (err) {
      expect(err.message).toBe('Not processing test/bad/2016-08-27 10.20.04.jpg because it is not an original image.');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if root is not recognized', async () => {
    const req: BasicRequest = {
      event: _.cloneDeep(fakeEvent),
      deps: {
        logger: mockLogger,
      },
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'bad/orig/2016-08-27+10.20.04.jpg';

    try {
      await extractFromEvent(req);
    } catch (err) {
      expect(err.message).toBe('key does not start with a recognized folder:bad/orig/2016-08-27 10.20.04.jpg');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
