import {Strategy as GoogleStrategy, Profile as GoogleProfile} from 'passport-google-oauth20';
import {findOrCreateOAuthUser} from '../findOrCreateOAuthUser';
import {oAuthConfig} from '../../config/oauth.config';
import {Request} from 'express';
import passport from 'passport';
import {log} from '../../lib/logs/logger';

const googleConfig = oAuthConfig.google;

if (googleConfig.enable) {
  passport.use(new GoogleStrategy({
    callbackURL: googleConfig.callback,
    clientID: googleConfig.client,
    clientSecret: googleConfig.secret,
    passReqToCallback: true,
  }, async (
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done,
  ) => {
    try {
      const user = await findOrCreateOAuthUser(profile);
      done(null, user);
    } catch (error) {
      log.debug('[passport.google] Error in GoogleStrategy:', error)
      done(error, undefined);
    }
  }));
}