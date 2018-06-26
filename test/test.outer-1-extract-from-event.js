const _ = require('lodash');

const { fakeEvent, mockLogger, mockLoggerReset } = require('./helper');
const extractFromEvent = require('../src/outer-1-extract-from-event');

describe('extractFromEvent', () => {
  beforeEach(() => {
    mockLoggerReset();
  });

  test('should build an object', async () => {
    const req = {
      event: fakeEvent,
      deps: {
        logger: mockLogger,
      },
    };

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

  test('should throw if image type not recognized', async () => {
    const req = {
      event: _.cloneDeep(fakeEvent),
      deps: {
        logger: mockLogger,
      },
    };

    req.event.Records[0].s3.object.key = 'abc.jjj';

    try {
      await extractFromEvent(req);
    } catch (err) {
      expect(err.message).toBe('skipping non-image abc.jjj');
    }

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });
});
