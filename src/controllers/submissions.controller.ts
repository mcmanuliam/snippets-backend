import {Types} from 'mongoose';
import {snippetModel} from '../models/snippet';
import {submissionModel} from '../models/submission';
import {userModel} from '../models/user';
import {Request, Response} from 'express';

export async function createSubmission(req: Request, res: Response): Promise<void> {
  if (!req.user || !req.params.id) {
    return res.badRequest();
  }

  try {
    const snippet = await snippetModel.findById(new Types.ObjectId(req.params.id));
    if (!snippet) {
      throw Error('Unable to create submission snippet not found');
    }

    const user = await userModel.findById(new Types.ObjectId(req.user._id));
    if (!user) {
      throw Error('Unable to create submission user not found');
    }

    const submission = submissionModel.create({
      snippet: snippet._id,
      user: user._id,
    })

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
}
