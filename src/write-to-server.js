'use strict';

var env = require('./env.json');

function httpPost(req, cb) {
  var https = req.deps.https;
  console.log('env:', env);

  var postData = JSON.stringify({
    metadata: req.input.data.s3Object.Metadata,
    imageSizes: req.imageSizes
  });

  var options = {
    hostname: 'plaaant.com',
    port: 443,
    path: '/api/image-complete?token=' + env.PLANT_IMAGE_COMPLETE,
    method: 'PUT'
  };

  var request = https.request(options, function() {});
  request.write(postData);
  request.end();

  cb();
}

module.exports = {
  httpPost: httpPost
};
