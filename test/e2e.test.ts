// eslint-disable-next-line import/no-unresolved
import { Context } from 'aws-lambda';
import { GetObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';

import { fakeEvent } from './helper';
import * as index from '../src';

jest.mock('node-fetch', () => (() => ({
  status: 200,
})));

// eslint-disable-next-line security/detect-non-literal-fs-filename
const Body = fs.readFileSync(path.join(__dirname, '/fixtures/passiflora-arida.jpg'));

export const fakeS3Object: GetObjectOutput = {
  AcceptRanges: 'bytes',
  LastModified: new Date('Tue, 06 Sep 2016 22:45:04 GMT'),
  ContentLength: 2718943,
  ETag: '"244c6ae2eeaf49e7f84070864aa3fa26"',
  ContentType: 'image/jpeg',
  Metadata: {
    userid: '12345',
    originalname: '987.jpg',
  },
  Body,
};

const writeImage = async (putObject: PutObjectRequest) => {
  const [, sizeName] = putObject.Key.split('/');
  const outFile = path.join(__dirname, '/fixtures/', `${sizeName}.jpg`);
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(outFile, putObject.Body);
  Promise.resolve();
};

const mockS3 = {
  getObject() {
    return {
      promise: () => Promise.resolve(fakeS3Object),
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  putObject(putObject: PutObjectRequest) {
    return {
      promise: () => writeImage(putObject),
    };
  },
};

jest.mock('aws-sdk', () => ({
  S3: function S3() {
    return mockS3;
  },
}));

describe('end-2-end', () => {
  test('process fixture images', (end) => {
    delete process.env.LALOG_LEVEL;
    const ctx: Context = {
      done(err: Error|null) {
        expect(err).toBeFalsy();
        // 1 Assertion from above
        // 4 Assertions from logger.create()
        expect.assertions(5);
        end();
      },
    } as Context;

    index.handler(fakeEvent, ctx);
  });
});
