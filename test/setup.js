const { loggerMock: mockLogger } = require('./helper');

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
