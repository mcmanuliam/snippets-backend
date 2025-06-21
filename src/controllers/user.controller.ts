import {Request, Response} from 'express';
import {UserDocument, userModel} from '../models/user';
import {Types} from 'mongoose';

export async function current(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    return res.badRequest();
  }

  try {
    const user = await userModel.findById<UserDocument>(req.user._id)
    if (!user) {
      return res.notFound();
    }

    return res.ok(user);
  } catch (error) {
    return res.negotiate(error);
  }
}

export async function findById(req: Request, res: Response): Promise<void> {
  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const user = await userModel.findById<UserDocument>(new Types.ObjectId(req.params.id))
    if (!user) {
      return res.notFound();
    }

    res.ok(user);
  } catch (error) {
    res.negotiate(error);
  }
}
