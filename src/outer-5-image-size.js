'use strict';

var gm = require('gm').subClass({
  imageMagick: true
});

// #5
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
function getImageSize(data, next) {
  console.log('o5 getImageSize');
  gm(data.buffer).size(function(err, size) {
    console.log('o5 got size:', size);
    data.imageSize = size;
    console.log('o5 size done');
    next(err, data);
  });
}

module.exports = {
  getImageSize: getImageSize
};
