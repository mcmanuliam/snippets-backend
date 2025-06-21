import {NextFunction, Request, Response} from 'express';
import {UserDocument, userModel} from '../models/user';
import {sign, verify} from '../lib/middleware/auth/jwt';
import {log} from '../lib/logs/logger';
import passport from 'passport';

const scopeMap: Record<string, string[]> = {
  discord: ['identify', 'email'],
  github: ['user:email'],
  google: ['profile', 'email'],
};

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const {provider} = req.params;
  const {redirectUri} = req.query;
  const scope = scopeMap[provider] || [];

  const state = redirectUri && typeof redirectUri === 'string'
    ? Buffer.from(redirectUri).toString('base64url')
    : undefined;

  passport.authenticate(provider, {
    scope,
    session: false,
    state,
  })(req, res, next);
}

export async function callback(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {provider} = req.params;

  passport.authenticate(provider, {
    failureRedirect: '/',
    session: false,
  }, async (err: unknown, user: UserDocument) => {
    if (err || !user) {
      log.debug(`[oauth.${provider}.callback] Authentication error:`, err);
      return next(err);
    }

    req.user = user;
    const redirectUri = req.query.state
      ? Buffer.from(req.query.state as string, 'base64url').toString('utf8')
      : '/';

    const tokenPayload = {_id: user._id}
    const token = sign(tokenPayload);
    const refresh = sign(tokenPayload, true);
    await userModel.updateOne({_id: user._id}, {refresh});

    const redirectURL = `${redirectUri}?token=${token}&refresh=${refresh}`;

    return res.redirect(redirectURL);
  })(req, res, next);
}

export async function logout(req: Request, res: Response): Promise<void> {
  await userModel.findByIdAndUpdate(req.user!._id, {
    $unset: {refreshToken: ''},
  }).exec();

  req.logout(() => req.session.destroy(() => {}));
  res.ok();
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const {currentRefresh} = req.body;

  try {
    const payload = verify(currentRefresh) as { _id: string };
    const user = await userModel.findById(payload._id);
    if (!user || user.refresh !== currentRefresh) {
      return res.unauthorized();
    }

    const tokenPayload = {_id: user._id}
    const newAccessToken = sign(tokenPayload);
    const newRefreshToken = sign(tokenPayload, true);

    await userModel.updateOne({_id: user._id}, {refresh: newRefreshToken});

    return res.ok({
      refresh: newRefreshToken,
      token: newAccessToken,
    });
  } catch {
    return res.unauthorized();
  }
}
