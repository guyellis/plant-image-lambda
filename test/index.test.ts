import sharp, { Sharp, Metadata } from 'sharp';

import { fakeEvent } from './helper';

import * as index from '../src';

global.fetch = jest.fn().mockImplementation((): { status: number; } => ({
  status: 200,
}));

jest.mock('sharp');

const sharpMock = sharp as unknown as jest.Mock;

const metadataMocker: Metadata = {
  chromaSubsampling: '4:2:0:4',
  height: 500,
  width: 500,
} as Metadata;

const sharpMocker: Sharp = {
  jpeg: () => sharpMocker,
  metadata: () => Promise.resolve(metadataMocker),
  resize: () => sharpMocker,
  toBuffer: () => Promise.resolve(Buffer.from('')),
} as Sharp;

sharpMock.mockImplementation(() => sharpMocker);

describe('index-handler', () => {
  test('should run end-to-end', async () => {
    delete process.env.LALOG_LEVEL;

    const result = await index.handler(fakeEvent);
    expect(result).toMatchInlineSnapshot('undefined');

    // 1 Assertion from above
    // 4 Assertions from logger.create()
    expect.assertions(5);
  });
});
