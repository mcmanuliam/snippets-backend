import {NextFunction, Request, Response} from 'express';
import {RequestInterface} from '../../models/request';
import {StatusError} from '../../util/response-helpers';
import {queueRequest} from '../logs/request-queue';

const enum DefaultMessages {
  SUCCESS = 'Request successful',
  FAIL = 'Request failed',
  ERROR = 'Internal Server Error'
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData: RequestInterface = {
      ip: req.ip,
      message: res.locals.message,
      method: req.method,
      responseTime: duration,
      statusCode: res.statusCode,
      timestamp: new Date(),
      url: req.originalUrl,
      user: req.user?._id,
      userAgent: req.headers['user-agent'],
    };

    queueRequest(logData);
  });

  next();
};

export function errorLogger(err: StatusError, req: Request, res: Response, next: NextFunction): void {
  const logData: RequestInterface = {
    ip: req.ip,
    message: err.message || res.locals.message || DefaultMessages.ERROR,
    method: req.method,
    responseTime: 0,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    timestamp: new Date(),
    url: req.originalUrl,
    user: req.user?._id,
    userAgent: req.headers?.['user-agent'],
  };

  queueRequest(logData);

  if (res.headersSent) {
    return next(err)
  };

  res.negotiate(err);
}
