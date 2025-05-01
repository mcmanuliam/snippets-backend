import env from '../util/env';

interface PlatformConfig {
  cookie: CookieConfig;

  mongo: MongoConfig;

  redis: RedisConfig;
}

interface CookieConfig {
  name: string;

  localLifespan: number;

  secret: string;
}

interface MongoConfig {
  uri: string;
}

interface RedisConfig {
  host: string;

  port: number;

  password?: string;

  tlsEnabled: boolean;

  db?: number;

  uri: string;
}

export const platformConfig: PlatformConfig = {
  cookie: {
    localLifespan: 1000 * 60 * 60 * 24 * 5,
    name: '__bytedsized.sid',
    secret: env('JWT_SECRET'),
  },

  mongo: {
    uri: env('MONGO_URI'),
  },

  redis: {
    db: parseInt(env('REDIS_DB', '0')),
    host: env('REDIS_HOST', 'localhost'),
    password: env('REDIS_PASSWORD', undefined),
    port: parseInt(env('REDIS_PORT', '6379')),
    tlsEnabled: Boolean(env('REDIS_TLS')) || false,

    get uri() {
      const protocol = this.tlsEnabled ? 'rediss' : 'redis';
      const auth = this.password ? `:${this.password}@` : '';

      return `${protocol}://${auth}${this.host}:${this.port}/${this.db}${this.tlsEnabled ? '?tls=1' : ''}`;
    },
  },
};