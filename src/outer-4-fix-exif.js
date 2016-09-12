'use strict';

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
  var gm = req.deps.gm;
  var data = req.data;
  console.log('o4 fixExif');
  gm(data.buffer)
    .autoOrient()
    .toBuffer('JPG', function(toBufferError, buffer){
      data.buffer = buffer;
      next(toBufferError, req);
    });
}

module.exports = {
  fixExif: fixExif
};
