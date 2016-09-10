'use strict';

var gm = require('gm').subClass({
  imageMagick: true
});

// #3
// data:
//   bucketName
//   key
//   fileName
//   imageType
//   s3Object
function convertToJpg(data, next) {
  // convert eps images to png
  console.time('convertToJpg');
  var response = data.s3Object;
  console.log('Reponse content type: ' + response.ContentType);
  console.log('Conversion');
  gm(response.Body)
    .antialias(true)
    .density(300)
    .toBuffer('JPG', function(err, buffer) {
      if(err) {
        console.error('convertToJpg error in toBuffer:', err);
      }
      data.buffer = buffer;
      console.timeEnd('convertToJpg');
      next(err, data);
    });
}


module.exports = {
  convertToJpg: convertToJpg,
};
