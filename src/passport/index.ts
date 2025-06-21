import {UserDocument, userModel} from '../models/user';
import {CallbackError} from 'mongoose';

import './strategies/github'
import './strategies/discord'
import './strategies/google'

import passport from 'passport';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findById<UserDocument>(id);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error as CallbackError);
  }
});

export default passport;
