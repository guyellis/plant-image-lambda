import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { LogData } from 'lalog/dist/local-types';

import { ExtractFromEventResponse, ExtractFromEventData } from './outer-1-extract-from-event';
import { getError } from './utils';

export interface GetImageFromS3Data extends ExtractFromEventData {
  s3Object: GetObjectOutput;
}

export interface GetImageFromS3Response extends Omit<ExtractFromEventResponse, 'data'> {
  data: GetImageFromS3Data;
}

const TIME_KEY = 'getImageFromS3';

// #2
// data has: bucketName, key, fileName, imageType
export const getImageFromS3 = async (
  req: Readonly<ExtractFromEventResponse>,
): Promise<Readonly<GetImageFromS3Response>> => {
  const { data, deps: { s3, logger } } = req;
  logger.time(TIME_KEY);
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
    const logData: LogData = {
      nextData,
    };
    logger.timeEnd(TIME_KEY, 'info', logData);
    return response;
  } catch (error) {
    const err = getError(error);
    logger.timeEnd(TIME_KEY, 'error', {
      err,
      msg: 'Error in s3.getObject() via getImageFromS3()',
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
