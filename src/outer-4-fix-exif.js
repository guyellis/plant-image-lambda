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
  console.log('o4 fixExif');
  next(null, req);
}

module.exports = {
  fixExif: fixExif
};
