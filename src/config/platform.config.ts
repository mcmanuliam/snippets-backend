import type {StringValue} from 'ms';
import type {Algorithm} from 'jsonwebtoken'
import env from '../util/env';

interface PlatformConfig {
  jwt: JwtConfig;

  mongo: MongoConfig;

  host: string;

  name: string;
}

interface JwtConfig {
  accessExpiresIn: StringValue;

  refreshExpiresIn: StringValue;

  secret: string;

  algorithm: Algorithm;
}

interface MongoConfig {
  uri: string;
}

export const platformConfig: PlatformConfig = {
  host: env('HOST'),

  jwt: {
    accessExpiresIn: '1h',
    algorithm: 'HS256',
    refreshExpiresIn: '30d',
    secret: env('JWT_SECRET'),
  },

  mongo: {
    uri: env('MONGO_URI'),
  },

  name: 'bytesized',
};
