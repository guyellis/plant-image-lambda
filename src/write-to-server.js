'use strict';

var env = require('./env.json');

function httpPost(req, cb) {
  var https = req.deps.https;
  console.log('env:', env);

  var putData = JSON.stringify({
    metadata: req.data.s3Object.Metadata,
    sizes: req.data.sizes
  });

  console.log('PUT data:', putData);

  var options = {
    hostname: 'plaaant.com',
    port: 443,
    path: '/api/image-complete?token=' + env.PLANT_IMAGE_COMPLETE,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(putData)
    }
  };

  console.log('About to PUT to server...');
  var request = https.request(options, function(res) {
    console.log('response from https.request:', res);
    cb(null, req);
  });
  request.write(putData);
  request.end();

  request.on('error', function(e) {
    console.error('Error in https.request:', e);
  });

  console.log('Completed PUT to server...');
}

module.exports = {
  httpPost: httpPost
};
