import {isObjectIdOrHexString, Types} from 'mongoose';
import {postModel} from '../models/post';
import {SubmissionDocument, submissionModel} from '../models/submission';
import {userModel} from '../models/user';
import {Request, Response} from 'express';

// todo: replace with user session once auth is implemented
const MOCK_USER_ID = '679faa68cbe67bccffe512a5';

async function getUserAndPost(pid: string, uid: string) {
  const [post, user] = await Promise.all([
    postModel.findById(new Types.ObjectId(pid)),
    userModel.findById(new Types.ObjectId(uid)),
  ]);

  return {post, user};
}

export async function create(req: Request, res: Response): Promise<void> {
  const {id: sid} = req.params;
  if (!isObjectIdOrHexString(sid)) {
    return res.badRequest();
  }

  try {
    const {post, user} = await getUserAndPost(sid, MOCK_USER_ID);
    if (!post || !user) {
      return res.notFound();
    }

    const submission = await submissionModel.create({
      code: {
        code: post.signature.code,
        language: post.signature.language,
      },
      post: post._id,
      user: user._id,
    });

    res.ok(submission);
  } catch (error) {
    res.negotiate(error);
  }
}

export async function find(req: Request, res: Response): Promise<void> {
  const {id: sid} = req.params;
  if (!isObjectIdOrHexString(sid)) {
    return res.badRequest();
  }

  try {
    const submission = await submissionModel.findOne<SubmissionDocument>({
      post: new Types.ObjectId(sid),
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
  const {id: sid} = req.params;
  if (!isObjectIdOrHexString(sid)) {
    return res.badRequest();
  }

  try {
    const found = await submissionModel.findOne<SubmissionDocument>({
      post: new Types.ObjectId(sid),
      user: new Types.ObjectId(MOCK_USER_ID),
    });

    if (found) {
      return res.ok(found);
    }

    const {post, user} = await getUserAndPost(sid, MOCK_USER_ID);
    if (!post || !user) {
      return res.notFound();
    }

    const created = await submissionModel.create({
      implementation: {
        code: post.signature.code,
        language: post.signature.language,
      },
      post: post._id,
      user: user._id,
    });

    res.ok(created);
  } catch (error) {
    res.negotiate(error);
  }
}
