'use strict';

var env = require('./env.json');

function httpPost(req, cb) {
  console.log('env:', env);
  cb();
}

module.exports = {
  httpPost: httpPost
};
