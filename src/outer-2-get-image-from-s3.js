// TODO: Replace console with logging
/* eslint-disable no-console */

// #2
// data has: bucketName, key, fileName, imageType
function getImageFromS3(req) {
  const { data, deps: { s3, logger } } = req;
  logger.time('getImageFromS3');
  logger.trace({ msg: '2. getImageFromS3()' });
  // Download the image from S3 into a buffer.
  // sadly it downloads the image several times, but we couldn't place it outside
  // the variable was not recognized
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: data.bucketName,
      Key: data.key,
    }, (err, s3Object) => {
      if (err) {
        logger.timeEnd.error('getImageFromS3', {
          msg: 'Error in s3.getObject()',
          err,
        });
        return reject(err);
      }
      data.s3Object = s3Object;
      logger.timeEnd('getImageFromS3');
      return resolve(req);
    });
  });
}


module.exports = getImageFromS3;

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

/* eslint-enable no-console */
