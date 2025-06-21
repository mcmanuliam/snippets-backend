import {sign} from '../lib/middleware/auth/jwt';
import {UserDocument, userModel} from '../models/user';

type OAuthProfile = {
  id: string;
  username?: string;
  displayName?: string;
  photos?: {value: string}[];
  provider: string;
};

export async function findOrCreateOAuthUser(profile: OAuthProfile): Promise<UserDocument> {
  const user = await userModel.findOne({
    provider: profile.provider,
    providerId: profile.id,
  });

  if (user) {
    return user;
  }

  const newUser = new userModel({
    avatar: profile.photos?.[0]?.value,
    provider: profile.provider,
    providerId: profile.id,
    refreshToken: sign(profile),
    username: profile.username ?? profile.displayName ?? 'unknown',
  });

  return await newUser.save();
}
