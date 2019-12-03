import { mockLogger, mockS3 } from './helper';

jest.mock('aws-sdk', () => ({
  S3: function S3() {
    return mockS3;
  },
}));

jest.mock('lalog', () => ({
  create: ({ serviceName, moduleName }: any) => {
    expect(serviceName).toBeTruthy();
    expect(moduleName).toBeTruthy();
    expect(typeof serviceName).toBe('string');
    expect(typeof moduleName).toBe('string');
    return mockLogger;
  },
  getLevel: () => 'info',
  setLevel: jest.fn(),
}));

jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'trace').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'timeEnd').mockImplementation();
