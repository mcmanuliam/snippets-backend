import {requestLogger, errorLogger} from './util/middleware/request';
import {responseHelpers} from './util/response-helpers';
import {platformConfig} from './config/platform.config';
import {sessionOptions} from './util/middleware/session';
import {corsConfig} from './util/middleware/cors';
import {loggingConfig} from './config/logging.config';
import {log} from './util/logs/logger';
import cookieParser from 'cookie-parser';
import appRouter from './routes/routes';
import {Express} from 'express';
import {colours} from './util/colours';
import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';

const PORT = 3600;

const initialise = async (app: Express) => {
  try {
    log.skip();

    await Promise.all([
      mongoose.connect(platformConfig.mongo.uri),
    ]);

    app.options('*', corsConfig);
    app.use(corsConfig);

    app.use(express.json());
    app.use(cookieParser());
    app.use(sessionOptions);

    app.use(passport.initialize());
    app.use(passport.session());

    if (loggingConfig.requestLogging) {
      app.use(requestLogger);
      log.verbose('Successfully set up Request Logging');
    }

    if (loggingConfig.errorLogging) {
      app.use(errorLogger);
      log.verbose('Successfully set up Failure Logging');
    }

    responseHelpers();

    app.use(appRouter);

    app.listen(PORT, () => {
      const ENV = process.env.NODE_ENV || 'development';
      const HOST = process.env.HOST || `http://localhost:${PORT}`;

      log.skip();
      log.info(`** ${colours.bright}Server listening on ${colours.underline}${HOST}${colours.reset} **`);
      if (ENV !== 'production') {
        log.info(`${colours.dim}note: this is a development server - for production use, see deployment docs${colours.reset}`);
      }
      log.skip();
    })

  } catch (error) {
    log.error('\nFailed to initialise application:\n', error);
    process.exit(1);
  }
};

const app = express();
initialise(app)
