import { Metadata } from 'sharp';
import { mockLogger } from './helper';
import { getImageSize } from '../src/outer-5-image-size';
import { ConvertToJpgResponse } from '../src/outer-3-convert-to-jpg';

describe('getImageSize', () => {
  beforeEach(() => {
    mockLogger.error = jest.fn();
  });
  test('should throw if size rejects', async () => {
    const req = {
      data: {
        buffer: 'fake-buffer',
        jpeg: {
          metadata: (): Promise<never> => Promise.reject('fake-size-error'),
        },
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ConvertToJpgResponse;

    await expect(getImageSize(req)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"fake-size-error"',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect.assertions(2);
  });

  test('should throw if width is missing rejects', async () => {
    const metadataMocker: Metadata = {
      chromaSubsampling: '4:2:0:4',
    } as Metadata;

    const req = {
      data: {
        buffer: 'fake-buffer',
        jpeg: {
          metadata: (): Promise<Metadata> => Promise.resolve(metadataMocker),
        },
      },
      deps: {
        logger: mockLogger,
      },
    } as unknown as ConvertToJpgResponse;

    await expect(() =>
      getImageSize(req),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      '"No width undefined in metadata"',
    );

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });
});
