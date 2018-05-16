'use strict';

const env = require('./env.json');

function httpPost(req, cb) {
  console.log('env:', env);

  const putData = JSON.stringify({
    metadata: req.data.s3Object.Metadata,
    sizes: req.data.sizes,
  });

  console.log('PUT data:', putData);

  const options = {
    hostname: env.PLANT_IMAGE_HOST,
    port: parseInt(env.PLANT_IMAGE_PORT, 10),
    path: `/api/image-complete?token=${env.PLANT_IMAGE_COMPLETE}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData),
    },
  };

  const https = options.port === 443 ? req.deps.https : req.deps.http;

  console.log('PUT options:', options);

  console.log('About to PUT to server...');
  const request = https.request(options, (res) => {
    console.log('response from https.request:', res);
    cb(null, req);
  });
  request.write(putData);
  request.end();

  request.on('error', (e) => {
    console.error('Error in http[s].request:', e);
  });

  console.log('Completed PUT to server...');
}

module.exports = {
  httpPost,
};
