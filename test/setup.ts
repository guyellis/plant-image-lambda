import Logger from 'lalog';
import { LaLogOptions } from 'lalog/dist/local-types';
import S3 from 'aws-sdk/clients/s3';

import { mockLogger, mockS3 } from './helper';

jest.mock('aws-sdk', () => ({
  S3: function S(): S3 {
    return mockS3 as unknown as S3;
  },
}));

jest.mock('lalog', () => ({
  create: ({ serviceName, moduleName }: LaLogOptions): Logger => {
    expect(serviceName).toBeTruthy();
    expect(moduleName).toBeTruthy();
    expect(typeof serviceName).toBe('string');
    expect(typeof moduleName).toBe('string');
    return mockLogger as Logger;
  },
  getLevel: (): string => 'info',
  setLevel: jest.fn(),
}));

jest.spyOn(console, 'log').mockImplementation();
jest.spyOn(console, 'trace').mockImplementation();
jest.spyOn(console, 'info').mockImplementation();
jest.spyOn(console, 'error').mockImplementation();
jest.spyOn(console, 'timeEnd').mockImplementation();
