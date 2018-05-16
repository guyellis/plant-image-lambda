'use strict';

// Event Structure: http://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html

/*
{
   "Records":[
      {
         "eventVersion":"2.0",
         "eventSource":"aws:s3",
         "awsRegion":"us-east-1",
         "eventTime":The time, in ISO-8601 format, for example, 1970-01-01T00:00:00.000Z, when S3 finished processing the request,
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
               "sequencer": "a string representation of a hexadecimal value used to determine event sequence,
                   only used with PUTs and DELETEs"
            }
         }
      },
      {
          // Additional events
      }
   ]
}
*/

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

module.exports = {
  fakeEvent,
  fakeS3Object,
};
