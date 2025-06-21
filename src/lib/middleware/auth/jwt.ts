import {platformConfig} from '../../../config/platform.config';
import jwt, {JwtPayload} from 'jsonwebtoken';

export function sign(payload: string | Buffer | object, refresh?: true): string {
  const expiresIn = refresh
    ? platformConfig.jwt.refreshExpiresIn
    : platformConfig.jwt.accessExpiresIn;

  return jwt.sign(
    payload,
    platformConfig.jwt.secret,
    {
      algorithm: platformConfig.jwt.algorithm,
      expiresIn,
      issuer: platformConfig.name,
    },
  );
};

export function verify(token: string): string | JwtPayload {
  return jwt.verify(token, platformConfig.jwt.secret);
};
