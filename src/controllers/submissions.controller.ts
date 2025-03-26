import {Types} from 'mongoose';
import {snippetModel} from '../models/snippet';
import {SubmissionDocument, submissionModel} from '../models/submission';
import {userModel} from '../models/user';
import {Request, Response} from 'express';

export async function createSubmission(req: Request, res: Response): Promise<void> {
  // TODO: replace with user session once auth is implemented
  const uId = '679faa68cbe67bccffe512a5';

  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const snippet = await snippetModel.findById(new Types.ObjectId(req.params.id));
    if (!snippet) {
      return res.notFound();
    }

    const user = await userModel.findById(new Types.ObjectId(uId));
    if (!user) {
      return res.notFound();
    }

    const submission = submissionModel.create({
      code: {
        code: snippet.signature.code,
        language: snippet.signature.language,
      },
      snippet: snippet._id,
      user: user._id,
    })

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
}

export async function findSubmission(req: Request, res: Response): Promise<void> {
  // TODO: replace with user session once auth is implemented
  const uId = '679faa68cbe67bccffe512a5';

  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const submission = await submissionModel
      .findOne<SubmissionDocument>({
        snippet: new Types.ObjectId(req.params.id),
        user: new Types.ObjectId(uId),
      })

    if (!submission) {
      return res.notFound();
    }

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
};
