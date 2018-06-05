

const path = require('path');

// #1
function extractFromEvent(req, cb) {
  const { event, deps } = req;
  const { logger } = deps;
  // Object key may have spaces or unicode non-ASCII characters.
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  // Infer the image type.
  const typeMatch = key.match(/\.([^.]*)$/);
  if (!typeMatch) {
    const msg = `unable to infer image type for key ${key}`;
    logger.error({
      msg,
      key: event.Records[0].s3.object.key,
      decodedKey: key,
    });
    return cb(msg);
  }

  const imageType = typeMatch[1].toLowerCase();

  if (!['jpg', 'gif', 'png', 'eps'].includes(imageType)) {
    const msg = `skipping non-image ${key}`;
    logger.error({ msg, imageType, key });
    return cb(msg);
  }

  if (!key.includes('/orig/')) {
    // This should not happen because the filter on S3 has been setup to be:
    // test/orig/ for test and
    // up/orig/ for prod
    const msg = `Not processing ${key} because it is not an original image.`;
    logger.error({ msg, key });
    return cb(msg);
  }

  // Compute root of key for output
  // The key either starts with one of:
  // test/orig/
  // up/orig/
  let outKeyRoot = key.split('/')[0];
  if (!['test', 'up'].includes(outKeyRoot)) {
    const msg = `key does not start with a recognized folder:${key}`;
    logger.error({ msg, key });
    return cb(msg);
  }
  outKeyRoot += '/';

  req.data = {
    bucketName: event.Records[0].s3.bucket.name,
    key,
    fileName: path.basename(key),
    imageType,
    outKeyRoot,
  };

  return cb(null, req);
}

module.exports = {
  extractFromEvent,
};

