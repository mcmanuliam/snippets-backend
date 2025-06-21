import {Strategy as GitHubStrategy, Profile as GitHubProfile} from 'passport-github2';
import {findOrCreateOAuthUser} from '../findOrCreateOAuthUser';
import {SessionUser} from '../../../@types/session-user';
import {oAuthConfig} from '../../config/oauth.config';
import {log} from '../../lib/logs/logger';
import {Request} from 'express';
import passport from 'passport';

const githubConfig = oAuthConfig.github;

if (githubConfig.enable) {
  passport.use(new GitHubStrategy({
    callbackURL: githubConfig.callback,
    clientID: githubConfig.client,
    clientSecret: githubConfig.secret,
    passReqToCallback: true,
  }, async (
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GitHubProfile,
    done: (error: unknown, user?: SessionUser) => void,
  ) => {
    try {
      const user = await findOrCreateOAuthUser(profile);
      done(null, user);
    } catch (err) {
      log.debug('[passport.github] Error in GitHubStrategy:', err)
      done(err, undefined);
    }
  }));
}