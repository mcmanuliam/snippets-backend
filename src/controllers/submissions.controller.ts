import {isObjectIdOrHexString, Types} from 'mongoose';
import {snippetModel} from '../models/snippet';
import {SubmissionDocument, submissionModel} from '../models/submission';
import {userModel} from '../models/user';
import {Request, Response} from 'express';

// todo: replace with user session once auth is implemented
const MOCK_USER_ID = '679faa68cbe67bccffe512a5';

async function getUserAndSnippet(snip: string, uid: string) {
  const [snippet, user] = await Promise.all([
    snippetModel.findById(new Types.ObjectId(snip)),
    userModel.findById(new Types.ObjectId(uid)),
  ]);

  return {snippet, user};
}

export async function create(req: Request, res: Response): Promise<void> {
  const {id: snip} = req.params;
  if (!isObjectIdOrHexString(snip)) {
    return res.badRequest();
  }

  try {
    const {snippet, user} = await getUserAndSnippet(snip, MOCK_USER_ID);
    if (!snippet || !user) {
      return res.notFound();
    }

    const submission = await submissionModel.create({
      code: {
        code: snippet.signature.code,
        language: snippet.signature.language,
      },
      snippet: snippet._id,
      user: user._id,
    });

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
}

export async function find(req: Request, res: Response): Promise<void> {
  const {id: snip} = req.params;
  if (!isObjectIdOrHexString(snip)) {
    return res.badRequest();
  }

  try {
    const submission = await submissionModel.findOne<SubmissionDocument>({
      snippet: new Types.ObjectId(snip),
      user: new Types.ObjectId(MOCK_USER_ID),
    });

    if (!submission) {
      return res.notFound();
    }

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
}

export async function findOrCreate(req: Request, res: Response): Promise<void> {
  const {id: snip} = req.params;
  if (!isObjectIdOrHexString(snip)) {
    return res.badRequest();
  }

  try {
    const found = await submissionModel.findOne<SubmissionDocument>({
      snippet: new Types.ObjectId(snip),
      user: new Types.ObjectId(MOCK_USER_ID),
    });

    if (found) {
      return res.ok(found);
    }

    const {snippet, user} = await getUserAndSnippet(snip, MOCK_USER_ID);
    if (!snippet || !user) {
      return res.notFound();
    }

    const created = await submissionModel.create({
      implementation: {
        code: snippet.signature.code,
        language: snippet.signature.language,
      },
      snippet: snippet._id,
      user: user._id,
    });

    res.ok(created);
  } catch (error) {
    res.negotiate(error);
  }
}
