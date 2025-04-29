import {platformConfig} from '../../config/platform.config';
import {redisClient} from '../../db/redis';
import {RedisStore} from 'connect-redis';
import session from 'express-session';

redisClient.connect().catch(console.error);

export const sessionOptions = session({
  cookie: {
    httpOnly: true,
    maxAge: platformConfig.cookie.localLifespan,
    sameSite: 'lax',
    secure: false,
  },
  name: platformConfig.cookie.name,
  resave: false,
  saveUninitialized: false,
  secret: platformConfig.cookie.secret,
  store: new RedisStore({client: redisClient}),
});
