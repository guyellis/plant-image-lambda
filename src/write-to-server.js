'use strict';

var env = require('./env.json');

function httpPost(req, cb) {
  console.log('env:', env);

  var putData = JSON.stringify({
    metadata: req.data.s3Object.Metadata,
    sizes: req.data.sizes
  });

  console.log('PUT data:', putData);

  var options = {
    hostname: env.PLANT_IMAGE_HOST,
    port: parseInt(env.PLANT_IMAGE_PORT, 10),
    path: '/api/image-complete?token=' + env.PLANT_IMAGE_COMPLETE,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData)
    }
  };

  var https = options.port === 443 ? req.deps.https : req.deps.http;

  console.log('PUT options:', options);

  console.log('About to PUT to server...');
  var request = https.request(options, function(res) {
    console.log('response from https.request:', res);
    cb(null, req);
  });
  request.write(putData);
  request.end();

  request.on('error', function(e) {
    console.error('Error in http[s].request:', e);
  });

  console.log('Completed PUT to server...');
}

module.exports = {
  httpPost: httpPost
};
