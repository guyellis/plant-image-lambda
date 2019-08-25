const fakeEvent = {
  Records: [{
    eventVersion: '2.0',
    eventSource: 'aws:s3',
    awsRegion: 'us-east-1',
    eventTime: '2016-09-10T00:28:36.547Z',
    eventName: 'ObjectCreated:Put',
    userIdentity: {
      principalId: 'AAAAAAAAAAAAA',
    },
    requestParameters: {
      sourceIPAddress: '1.2.3.4',
    },
    responseElements: {
      'x-amz-request-id': 'AAAAAAAAAAAAAAAA',
      'x-amz-id-2': 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo',
    },
    s3: {
      s3SchemaVersion: '1.0',
      configurationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      bucket: {
        name: 'example.com',
        ownerIdentity: {
          principalId: 'AAAAAAAAAAAAA',
        },
        arn: 'arn:aws:s3:::example.com',
      },
      object: {
        key: 'test/orig/2016-08-27+10.20.04.jpg',
        size: 4777321,
        eTag: '11111111111111111111111111111111',
        sequencer: 'AAAAAAAAAAAAAAAAAA',
      },
    },
  }],
};

const fakeS3Object = {
  AcceptRanges: 'bytes',
  LastModified: 'Tue, 06 Sep 2016 22:45:04 GMT',
  ContentLength: '2718943',
  ETag: '"244c6ae2eeaf49e7f84070864aa3fa26"',
  ContentType: 'image/jpeg',
  Metadata: {
    userid: '12345',
    originalname: '987.jpg',
  },
  Body: '<Buffer>',
};

const mockLogger = {};

const isObject = (obj: any) => obj !== null && typeof obj === 'object';

const loggerMockFunction = (errObj: any, extra?: any) => {
  if (!isObject(errObj)) {
    throw new Error(`First param to lalog logger method is not an object: ${typeof errObj}`);
  }
  if (extra) {
    const { res, code } = extra;
    res.status(code).send({ one: 1 });
  }
};

const loggerTimeEndMockFunction = (label: any, extraLogData: any) => {
  if (typeof label !== 'string') {
    throw new Error(`First param to lalog timeEnd method is not an string: ${typeof label}`);
  }
  if (extraLogData && !isObject(extraLogData)) {
    throw new Error(`Second param to lalog timeEnd method is not an object: ${typeof extraLogData}`);
  }
  if (extraLogData) {
    loggerMockFunction(extraLogData);
  }
};

const mockLoggerReset = () => {
  // const levels = ['trace', 'info', 'warn', 'error', 'fatal', 'security'];
  // @ts-ignore
  mockLogger.trace = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.info = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.warn = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.error = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.fatal = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.security = jest.fn(loggerMockFunction);
  // @ts-ignore
  mockLogger.timeEnd = jest.fn(loggerTimeEndMockFunction);
  // @ts-ignore
  mockLogger.timeEnd.error = jest.fn(loggerTimeEndMockFunction);
  // @ts-ignore
  mockLogger.time = jest.fn();
};

mockLoggerReset();

class mockGM {
  constructor() {
    // @ts-ignore - intentionally done like this for testing
    return () => this;
  }

  antialias() { return this; }

  autoOrient() { return this; }

  density() { return this; }

  resize() { return this; }

  // eslint-disable-next-line class-methods-use-this
  toBuffer(_: any, cb: Function) {
    cb(null, 'Fake Buffer');
  }

  size(cb: Function) {
    cb.call(this, null, { width: 3000, height: 2000 });
  }
}

const mockS3 = {
  getObject(_: any, cb: Function) {
    cb(null, fakeS3Object);
  },
  putObject(_: any, cb: Function) {
    cb();
  },
};

module.exports = {
  fakeEvent,
  fakeS3Object,
  mockGM,
  mockLogger,
  mockLoggerReset,
  mockS3,
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
