

const helper = require('./helper');
const extractFromEvent = require('../src/outer-1-extract-from-event');

describe('extractFromEvent', () => {
  test('should build an object', async () => {
    const req = {
      event: helper.fakeEvent,
      deps: {
        logger: {
          error: jest.fn(),
        },
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
    expect(req.deps.logger.error).not.toHaveBeenCalled();
  });
});
