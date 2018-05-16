// TODO: Replace console with logging
/* eslint-disable no-console */

// #2
// data has: bucketName, key, fileName, imageType
function getImageFromS3(req, cb) {
  const { data } = req;
  const { s3 } = req.deps;
  console.time('getImageFromS3');
  console.log('getImageFromS3');
  // Download the image from S3 into a buffer.
  // sadly it downloads the image several times, but we couldn't place it outside
  // the variable was not recognized
  s3.getObject({
    Bucket: data.bucketName,
    Key: data.key,
  }, (err, s3Object) => {
    data.s3Object = s3Object;
    console.timeEnd('getImageFromS3');
    return cb(err, req);
  });
}


module.exports = {
  getImageFromS3,
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

/* eslint-enable no-console */
