import { LoggingMiddleware } from './logging.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleSpy: jest.SpyInstance;

  const frozenDate = new Date('2023-01-01T00:00:00.000Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(frozenDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    middleware = new LoggingMiddleware();
    mockRequest = {
      method: 'GET',
      url: '/test',
    };
    mockResponse = {};
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log the request method and URL with the frozen time', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith(
      `[${frozenDate.toISOString()}] GET /test`,
    );
    expect(mockNext).toHaveBeenCalled();
  });
});
