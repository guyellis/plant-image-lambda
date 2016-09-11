'use strict';

var path = require('path');

// #1
function extractFromEvent(req, cb) {
  var event = req.event;
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
    console.error(err2);
    return cb(err2);
  }

  if(key.indexOf('/orig/') === -1) {
    // This should not happen because the filter on S3 has been setup to be:
    // test/orig/ for test and
    // up/orig/ for prod
    var err3 = 'Not processing ' + key + ' because it is not an original image.';
    console.error(err3);
    return cb(err3);
  }

  // Compute root of key for output
  // The key either starts with one of:
  // test/orig/
  // up/orig/
  var outKeyRoot = key.split('/')[0];
  if(['test', 'up'].indexOf(outKeyRoot) === -1) {
    var err4 = 'key does not start with a recognized folder:' + key;
    console.error(err4);
    return cb(err4);
  }
  outKeyRoot += '/';

  req.data = {
    bucketName: event.Records[0].s3.bucket.name,
    key: key,
    fileName: path.basename(key),
    imageType: imageType,
    outKeyRoot: outKeyRoot
  };

  return cb(null, req);
}

module.exports = {
  extractFromEvent: extractFromEvent
};
