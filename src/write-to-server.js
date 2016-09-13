'use strict';

var env = require('./env.json');

function httpPost() {
  console.log('env:', env);
}

module.exports = {
  httpPost: httpPost
};
