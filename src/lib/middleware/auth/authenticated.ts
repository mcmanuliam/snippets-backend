import {Request, Response, NextFunction} from 'express';
import {UserDocument, userModel} from '../../../models/user';
import {verify} from './jwt';

export async function authenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.unauthorized();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token) as {_id: string};
    const user = await userModel
      .findById(decoded._id)
      .select('_id avatar providerId username')
      .lean<UserDocument>()
      .exec();

    if (!user) {
      return res.unauthorized();
    }

    req.user = {
      _id: user._id,
      avatar: user.avatar,
      providerId: user.providerId,
      username: user.username,
    };

    return next();
  } catch {
    return res.unauthorized();
  }
}
