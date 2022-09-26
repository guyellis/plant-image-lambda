// eslint-disable-next-line import/no-unresolved
import { S3Event } from 'aws-lambda';
import { LogFunction, TimeLogFunction } from 'lalog';
import S3, { GetObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3';
import { Response, Headers } from 'node-fetch';

import { sharpMethod } from '../src/types';
import { PlantImageLogger } from '../src/logger';

export const makeFakeFetchResponse = (status: number): Response => {
  const response: Response = {
    headers: {} as Headers,
    ok: true,
    redirected: false,
    status,
    statusText: 'OK',
    type: 'default',
    url: 'fake-url',
  } as Response;
  return response;
};

export const fakeEvent: S3Event = {
  Records: [{
    awsRegion: 'us-east-1',
    eventName: 'ObjectCreated:Put',
    eventSource: 'aws:s3',
    eventTime: '2016-09-10T00:28:36.547Z',
    eventVersion: '2.0',
    requestParameters: {
      sourceIPAddress: '1.2.3.4',
    },
    responseElements: {
      'x-amz-id-2': 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
      'x-amz-request-id': 'AAAAAAAAAAAAAAAA',
    },
    s3: {
      bucket: {
        arn: 'arn:aws:s3:::example.com',
        name: 'example.com',
        ownerIdentity: {
          principalId: 'AAAAAAAAAAAAA',
        },
      },
      configurationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      object: {
        eTag: '11111111111111111111111111111111',
        key: 'test/orig/2016-08-27+10.20.04.jpg',
        sequencer: 'AAAAAAAAAAAAAAAAAA',
        size: 4777321,
      },
      s3SchemaVersion: '1.0',
    },
    userIdentity: {
      principalId: 'AAAAAAAAAAAAA',
    },
  }],
};

export const fakeS3Object: GetObjectOutput = {
  AcceptRanges: 'bytes',
  Body: '<Buffer>',
  ContentLength: 2718943,
  ContentType: 'image/jpeg',
  ETag: '"244c6ae2eeaf49e7f84070864aa3fa26"',
  LastModified: new Date('Tue, 06 Sep 2016 22:45:04 GMT'),
  Metadata: {
    originalname: '987.jpg',
    userid: '12345',
  },
};

export const mockLogger: PlantImageLogger = {} as PlantImageLogger;

const isObject = (obj: object): boolean => obj !== null && typeof obj === 'object';

const loggerMockFunction: LogFunction = (errObj, extra) => {
  if (!isObject(errObj)) {
    throw new Error(`First param to lalog logger method is not an object: ${typeof errObj}`);
  }
  if (extra) {
    const { res, code } = extra;
    res.status(code).send({ one: 1 });
  }
  return Promise.resolve();
};

const loggerTimeEndMockFunction: TimeLogFunction = async (
  label, level, extraLogData,
) => {
  if (typeof label !== 'string') {
    throw new Error(`1st param to lalog timeEnd method is not an string: ${typeof label}`);
  }
  if (level && typeof level !== 'string') {
    throw new Error(`2nd param to lalog timeEnd method is not an string: ${typeof level}`);
  }
  if (extraLogData && !isObject(extraLogData)) {
    throw new Error(`3rd param to lalog timeEnd method is not an object: ${typeof extraLogData}`);
  }
  if (extraLogData) {
    return loggerMockFunction(extraLogData);
  }
  return Promise.resolve();
};

export const mockLoggerReset = (): void => {
  mockLogger.trace = jest.fn(loggerMockFunction);
  mockLogger.info = jest.fn(loggerMockFunction);
  mockLogger.error = jest.fn(loggerMockFunction);
  mockLogger.timeEnd = jest.fn(loggerTimeEndMockFunction);
  mockLogger.time = jest.fn();
};

mockLoggerReset();

export const mockS3 = {
  getObject(): {promise: () => Promise<GetObjectOutput>; } {
    return {
      promise: (): Promise<S3.GetObjectOutput> => Promise.resolve(fakeS3Object),
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  putObject(_: PutObjectRequest): {promise: () => Promise<void>} {
    return {
      promise: (): Promise<void> => Promise.resolve(),
    };
  },
};

// Event Structure: http://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html

/*
{
   "Records":[
      {
         "eventVersion":"2.0",
         "eventSource":"aws:s3",
         "awsRegion":"us-east-1",
         "eventTime":The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z,
                     when S3 finished processing the request,
         "eventName":"event-type",
         "userIdentity":{
            "principalId":"Amazon-customer-ID-of-the-user-who-caused-the-event"
         },
         "requestParameters":{
            "sourceIPAddress":"ip-address-where-request-came-from"
         },
         "responseElements":{
            "x-amz-request-id":"Amazon S3 generated request ID",
            "x-amz-id-2":"Amazon S3 host that processed the request"
         },
         "s3":{
            "s3SchemaVersion":"1.0",
            "configurationId":"ID found in the bucket notification configuration",
            "bucket":{
               "name":"bucket-name",
               "ownerIdentity":{
                  "principalId":"Amazon-customer-ID-of-the-bucket-owner"
               },
               "arn":"bucket-ARN"
            },
            "object":{
               "key":"object-key",
               "size":object-size,
               "eTag":"object eTag",
               "versionId":"object version if bucket is versioning-enabled, otherwise null",
               "sequencer": "a string representation of a hexadecimal value used to determine
                   event sequence, only used with PUTs and DELETEs"
            }
         }
      },
      {
          // Additional events
      }
   ]
}
*/

export const fakeS3: S3 = {} as S3;

export const fakeSharpJpegError: sharpMethod = (() => ({
  // eslint-disable-next-line prefer-promise-reject-errors
  jpeg: () => Promise.reject('fake-jpeg-error'),
})) as unknown as sharpMethod;

const s3Object: GetObjectOutput = {

} as GetObjectOutput;

export const fakeInput = {
  bucketName: 'fake bucket name',
  buffer: Buffer.from('fake buffer'),
  fileName: 'fake file name',
  imageSize: { height: 200, name: 'fake image name', width: 200 },
  imageType: 'jpg',
  key: 'fake key',
  outKeyRoot: 'fake output key root',
  s3Object,
};
