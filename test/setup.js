const isObject = obj => obj !== null && typeof obj === 'object';

const loggerMockFunction = (errObj, extra) => {
  if (!isObject(errObj)) {
    throw new Error(`First param to lalog logger method is not an object: ${typeof errObj}`);
  }
  if (extra) {
    const { res, code } = extra;
    res.status(code).send({ one: 1 });
  }
};

global.loggerMock = {};

jest.mock('lalog', () => ({
  create: ({ serviceName, moduleName }) => {
    expect(serviceName).toBeTruthy();
    expect(moduleName).toBeTruthy();
    expect(typeof serviceName).toBe('string');
    expect(typeof moduleName).toBe('string');
    return global.loggerMock;
  },
  getLevel: () => 'info',
}));

global.loggerMockReset = () => {
  // const levels = ['trace', 'info', 'warn', 'error', 'fatal', 'security'];
  global.loggerMock.trace = jest.fn(loggerMockFunction);
  global.loggerMock.info = jest.fn(loggerMockFunction);
  global.loggerMock.warn = jest.fn(loggerMockFunction);
  global.loggerMock.error = jest.fn(loggerMockFunction);
  global.loggerMock.fatal = jest.fn(loggerMockFunction);
  global.loggerMock.security = jest.fn(loggerMockFunction);
};

global.loggerMockReset();
