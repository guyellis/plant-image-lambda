'use strict';

var path = require('path');

// #1
function extractFromEvent(event, cb) {
  // Object key may have spaces or unicode non-ASCII characters.
  var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  // Infer the image type.
  var typeMatch = key.match(/\.([^.]*)$/);
  if (!typeMatch) {
    var err = 'unable to infer image type for key ' + key;
    console.error(err);
    return cb(err);
  }

  var imageType = typeMatch[1].toLowerCase();

  if (['jpg', 'gif', 'png', 'eps'].indexOf(imageType) === -1) {
    var err2 = 'skipping non-image ' + key;
    console.log(err2);
    return cb(err2);
  }

  if(key.indexOf('/orig/') === -1) {
    var err3 = 'Not processing ' + key + ' because it is not an original image.';
    console.log(err3);
    return cb(err3);
  }

  return cb(null, {
    bucketName: event.Records[0].s3.bucket.name,
    key: key,
    fileName: path.basename(key),
    imageType: imageType
  });
}

module.exports = {
  extractFromEvent: extractFromEvent
};
