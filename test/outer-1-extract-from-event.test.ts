import _ from 'lodash';
import { fakeEvent, mockLogger, mockLoggerReset } from './helper';

import {
  extractFromEvent,
  BasicRequest,
} from '../src/outer-1-extract-from-event';

describe('extractFromEvent', () => {
  beforeEach(() => {
    mockLoggerReset();
  });

  test('should build an object', () => {
    const req: BasicRequest = {
      deps: {
        logger: mockLogger,
      },
      event: fakeEvent,
    } as BasicRequest;

    const expected = {
      bucketName: 'example.com',
      fileName: '2016-08-27 10.20.04.jpg',
      imageType: 'jpg',
      key: 'test/orig/2016-08-27 10.20.04.jpg',
      outKeyRoot: 'test/',
    };

    const actual = extractFromEvent(req);
    expect(actual.data).toEqual(expected);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  test('should log and throw if no key match', () => {
    const req: BasicRequest = {
      deps: {
        logger: mockLogger,
      },
      event: _.cloneDeep(fakeEvent),
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'abcjjj';

    expect(() => extractFromEvent(req)).toThrowErrorMatchingInlineSnapshot(
      '"unable to infer image type for key abcjjj"',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if image type not recognized', () => {
    const req: BasicRequest = {
      deps: {
        logger: mockLogger,
      },
      event: _.cloneDeep(fakeEvent),
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'abc.jjj';

    expect(() => extractFromEvent(req)).toThrowErrorMatchingInlineSnapshot(
      '"skipping non-image abc.jjj"',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if orig missing from key', async () => {
    const req: BasicRequest = {
      deps: {
        logger: mockLogger,
      },
      event: _.cloneDeep(fakeEvent),
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'test/bad/2016-08-27+10.20.04.jpg';

    expect(() => extractFromEvent(req)).toThrowErrorMatchingInlineSnapshot(
      '"Not processing test/bad/2016-08-27 10.20.04.jpg because it is not an original image."',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should log and throw if root is not recognized', async () => {
    const req: BasicRequest = {
      deps: {
        logger: mockLogger,
      },
      event: _.cloneDeep(fakeEvent),
    } as BasicRequest;

    req.event.Records[0].s3.object.key = 'bad/orig/2016-08-27+10.20.04.jpg';

    expect(() => extractFromEvent(req)).toThrowErrorMatchingInlineSnapshot(
      '"key does not start with a recognized folder:bad/orig/2016-08-27 10.20.04.jpg"',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
