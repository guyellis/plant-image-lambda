import S3, {
  GetObjectOutput,
  PutObjectRequest,
  PutObjectOutput,
} from 'aws-sdk/clients/s3';
import { promises as fs } from 'fs';
import path from 'path';

import { fakeEvent, makeFakeFetchResponse } from './helper';
import * as index from '../src';

global.fetch = jest.fn().mockImplementation(() => makeFakeFetchResponse(200));

export const getFakeS3Object = async (): Promise<GetObjectOutput> => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const Body = await fs.readFile(
    path.join(__dirname, '/fixtures/passiflora-arida.jpg'),
  );
  const objectOutput: GetObjectOutput = {
    AcceptRanges: 'bytes',
    Body,
    ContentLength: 2718943,
    ContentType: 'image/jpeg',
    ETag: '"244c6ae2eeaf49e7f84070864aa3fa26"',
    LastModified: new Date('Tue, 06 Sep 2016 22:45:04 GMT'),
    Metadata: {
      originalname: '987.jpg',
      userid: '12345',
    },
  };
  return objectOutput;
};

const writeImage = async (
  putObject: PutObjectRequest,
): Promise<PutObjectOutput> => {
  const [, sizeName] = putObject.Key.split('/');
  const outFile = path.join(__dirname, '/fixtures/', `${sizeName}.jpg`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await fs.writeFile(outFile, putObject.Body as string);
  return Promise.resolve({} as PutObjectOutput);
};

const mockS3: S3 = {
  getObject() {
    return {
      promise: (): Promise<GetObjectOutput> => getFakeS3Object(),
    };
  },
  putObject(putObject: PutObjectRequest) {
    return {
      promise: (): Promise<PutObjectOutput> => writeImage(putObject),
    };
  },
} as S3;

jest.mock('aws-sdk', () => ({
  S3: function S(): S3 {
    return mockS3;
  },
}));

describe('end-2-end', () => {
  test('process fixture images', async () => {
    delete process.env.LALOG_LEVEL;

    await expect(index.handler(fakeEvent)).resolves.toMatchInlineSnapshot(
      'undefined',
    );
    // 1 Assertion from above
    // 4 Assertions from logger.create()
    expect.assertions(5);
  });
});
