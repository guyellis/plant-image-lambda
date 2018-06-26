
const fetch = require('node-fetch');
const env = require('./env.json');

const {
  PLANT_IMAGE_HOST,
  PLANT_IMAGE_PORT,
  PLANT_IMAGE_COMPLETE,
} = env;

async function httpPost(req) {
  const {
    deps: {
      logger,
    },
    data: {
      s3Object: {
        Metadata: metadata,
      },
      sizes,
    },
  } = req;
  const { presets: { trackId } = {} } = logger;

  const putData = JSON.stringify({
    metadata,
    sizes,
    trackId, // Allows receiver to use same trackId for logging
  });

  const port = parseInt(PLANT_IMAGE_PORT, 10);
  const protocol = port === 443 ? 'https' : 'http';

  const url = `${protocol}://${PLANT_IMAGE_HOST}/api/image-complete?token=${PLANT_IMAGE_COMPLETE}`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData),
    },
  };

  try {
    const response = await fetch(url, options);
    const logData = {
      msg: 'Image sizing metadata update sent',
      url,
      options,
      env,
      putData,
      status: response.status,
    };
    if (response.status === 200) {
      logger.trace(logData);
    } else {
      logger.error({
        ...logData,
        msg: `Unexpected response status ${response.status} in PUT call`,
      });
    }
  } catch (err) {
    logger.error({
      msg: 'Error sending image sizing metadata',
      url,
      options,
      env,
      putData,
    });
  }

  return req;
}

module.exports = httpPost;
