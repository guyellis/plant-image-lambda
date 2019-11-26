import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { TimeEndLogger, TimeEndLoggerFunc } from './types';
import { ExtractFromEventResponse, ExtractFromEventData } from './outer-1-extract-from-event';


export interface GetImageFromS3Data extends ExtractFromEventData {
  s3Object: GetObjectOutput;
}

export interface GetImageFromS3Response extends Omit<ExtractFromEventResponse, 'data'> {
  data: GetImageFromS3Data;
}

// #2
// data has: bucketName, key, fileName, imageType
export const getImageFromS3 = async (
  req: ExtractFromEventResponse): Promise<GetImageFromS3Response> => {
  const { data, deps: { s3, logger } } = req;
  logger.time('getImageFromS3');
  logger.trace({ msg: '2. getImageFromS3()' });
  // Download the image from S3 into a buffer.
  // sadly it downloads the image several times, but we couldn't place it outside
  // the variable was not recognized
  try {
    const s3Object: GetObjectOutput = await s3.getObject({
      Bucket: data.bucketName,
      Key: data.key,
    }).promise();

    const nextData: GetImageFromS3Data = {
      ...data,
      s3Object,
    };
    const response: GetImageFromS3Response = {
      ...req,
      data: nextData,
    };
    (logger.timeEnd as TimeEndLoggerFunc)('getImageFromS3');
    return response;
  } catch (err) {
    (logger.timeEnd as TimeEndLogger).error('getImageFromS3', {
      msg: 'Error in s3.getObject() via getImageFromS3()',
      err,
    });
    throw err;
  }
};

/*
The s3Object returned by s3.getObject will look something like this:

{ AcceptRanges: 'bytes',
  LastModified: 'Tue, 06 Sep 2016 22:45:04 GMT',
  ContentLength: '2718943',
  ETag: '"244c6ae2eeaf49e7f84070864aa3fa26"',
  ContentType: 'image/jpeg',
  Metadata:
   { userid: 'xxxxxxxxxxxxxxxxx',
     originalname: 'zzzzzzzzzzzzzz.jpg' },
  Body: <Buffer
*/
