'use strict';

// #2
// data has: bucketName, key, fileName, imageType
function getImageFromS3(req, cb) {
  var data = req.data;
  var s3 = req.deps.s3;
  console.time('getImageFromS3');
  console.log('getImageFromS3');
  // Download the image from S3 into a buffer.
  // sadly it downloads the image several times, but we couldn't place it outside
  // the variable was not recognized
  s3.getObject({
    Bucket: data.bucketName,
    Key: data.key
  }, function(err, s3Object) {
    data.s3Object = s3Object;
    console.timeEnd('getImageFromS3');
    return cb(err, req);
  });
}


module.exports = {
  getImageFromS3: getImageFromS3,
};
