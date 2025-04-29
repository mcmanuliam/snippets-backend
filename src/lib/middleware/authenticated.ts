import {Request, Response, NextFunction} from 'express';

export function authenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  }

  res.unauthorized();
}
