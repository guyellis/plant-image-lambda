'use strict';

const imageSizes = require('./image-sizes');

// #5
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
function getImageSize(req, next) {
  const gm = req.deps.gm;
  const data = req.data;
  console.log('o5 getImageSize');
  gm(data.buffer).size((err, size) => {
    console.log('o5 got size:', size);
    data.imageSize = size;
    data.sizes = imageSizes.calcSizes(size.width);
    console.log('o5 size done:', data.sizes);
    next(err, req);
  });
}

module.exports = {
  getImageSize,
};
