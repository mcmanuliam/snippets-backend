import {Strategy as DiscordStrategy, Profile as DiscordProfile} from 'passport-discord';
import {findOrCreateOAuthUser} from '../findOrCreateOAuthUser';
import {oAuthConfig} from '../../config/oauth.config';
import {Request} from 'express';
import passport from 'passport';
import {log} from '../../lib/logs/logger';

const discordConfig = oAuthConfig.discord;

if (discordConfig.enable) {
  passport.use(new DiscordStrategy({
    callbackURL: discordConfig.callback,
    clientID: discordConfig.client,
    clientSecret: discordConfig.secret,
    passReqToCallback: true,
  }, async (
    _req: Request,
    _accessToken,
    _refreshToken,
    profile: DiscordProfile,
    done,
  ) => {
    try {
      const user = await findOrCreateOAuthUser(profile);
      done(null, user);
    } catch (error) {
      log.debug('[passport.discord] Error in DiscordStrategy:', error)
      done(error, undefined);
    }
  }));
}
