'use strict';

var fakeEvent = {
  Records: [{
    eventVersion: '2.0',
    eventSource: 'aws:s3',
    awsRegion: 'us-east-1',
    eventTime: '2016-09-10T00:28:36.547Z',
    eventName: 'ObjectCreated:Put',
    userIdentity: {
      principalId: 'AAAAAAAAAAAAA'
    },
    requestParameters: {
      sourceIPAddress: '1.2.3.4'
    },
    responseElements: {
      'x-amz-request-id': 'AAAAAAAAAAAAAAAA',
      'x-amz-id-2': 'oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo'
    },
    s3: {
      s3SchemaVersion: '1.0',
      configurationId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      bucket: {
        name: 'example.com',
        ownerIdentity: {
          principalId: 'AAAAAAAAAAAAA'
        },
        arn: 'arn:aws:s3:::example.com'
      },
      object: {
        key: 'test/orig/2016-08-27+10.20.04.jpg',
        size: 4777321,
        eTag: '11111111111111111111111111111111',
        sequencer: 'AAAAAAAAAAAAAAAAAA'
      }
    }
  }]
};

module.exports = {
  fakeEvent: fakeEvent
};
