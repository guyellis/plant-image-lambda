'use strict';


// #5
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
//   buffer
function getImageSize(req, next) {
  var gm = req.deps.gm;
  var data = req.data;
  console.log('o5 getImageSize');
  gm(data.buffer).size(function(err, size) {
    console.log('o5 got size:', size);
    data.imageSize = size;
    console.log('o5 size done');
    next(err, req);
  });
}

module.exports = {
  getImageSize: getImageSize
};
