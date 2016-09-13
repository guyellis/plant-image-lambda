'use strict';

var env = require('./env.json');

function httpPost(req, cb) {
  var https = req.deps.https;
  console.log('env:', env);

  var postData = JSON.stringify({
    metadata: req.data.s3Object.Metadata,
    sizes: req.data.sizes
  });

  var options = {
    hostname: 'plaaant.com',
    port: 443,
    path: '/api/image-complete?token=' + env.PLANT_IMAGE_COMPLETE,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('About to PUT to server...');
  var request = https.request(options, function(res) {
    console.log('response from https.request:', res);
  });
  request.write(postData);
  request.end();

  request.on('error', function(e) {
    console.error('Error in https.request:', e);
  });

  console.log('Completed PUT to server...');

  cb(null, req);
}

module.exports = {
  httpPost: httpPost
};
