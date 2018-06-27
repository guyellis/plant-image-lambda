const { mockLogger, fakeS3Object } = require('./helper');

const mockS3 = {
  getObject(obj, cb) {
    cb(null, fakeS3Object);
  },
  putObject(obj, cb) {
    cb();
  },
};

jest.mock('aws-sdk', () => ({
  S3: function S3() {
    return mockS3;
  },
}));

jest.mock('lalog', () => ({
  create: ({ serviceName, moduleName }) => {
    expect(serviceName).toBeTruthy();
    expect(moduleName).toBeTruthy();
    expect(typeof serviceName).toBe('string');
    expect(typeof moduleName).toBe('string');
    return mockLogger;
  },
  getLevel: () => 'info',
}));
