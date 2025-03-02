import {CorsOptions} from 'cors';
import cors from 'cors';

const whitelist = new Set([
  'http://localhost:4200',
  'http://localhost:8100',
]);

const corsOptions: CorsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: function(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.has(origin)) {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
};

export const corsConfig = cors(corsOptions);
