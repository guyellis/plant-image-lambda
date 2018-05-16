

// var gm = require('gm').subClass({
//   imageMagick: true
// });

// #4
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
function fixExif(req, next) {
  const { gm } = req.deps;
  const { data } = req;
  console.log('o4 fixExif');
  gm(data.buffer)
    .autoOrient()
    .toBuffer('JPG', (toBufferError, buffer) => {
      data.buffer = buffer;
      next(toBufferError, req);
    });
}

module.exports = {
  fixExif,
};
