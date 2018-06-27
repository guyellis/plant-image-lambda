const { mockLogger, mockS3 } = require('./helper');


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
