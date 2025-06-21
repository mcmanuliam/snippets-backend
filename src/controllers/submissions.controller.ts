import {isObjectIdOrHexString, Types} from 'mongoose';
import {postModel} from '../models/post';
import {SubmissionDocument, submissionModel} from '../models/submission';
import {userModel} from '../models/user';
import {Request, Response} from 'express';

async function getUserAndPost(pid: string, uid: string) {
  const [post, user] = await Promise.all([
    postModel.findById(new Types.ObjectId(pid)),
    userModel.findById(new Types.ObjectId(uid)),
  ]);

  return {post, user};
}

export async function findOrCreate(req: Request, res: Response): Promise<void> {
  const userId = req.user?._id!;
  const {id: sid} = req.params;
  if (!isObjectIdOrHexString(sid)) {
    return res.badRequest();
  }

  try {
    const found = await submissionModel.findOne<SubmissionDocument>({
      post: new Types.ObjectId(sid),
      user: new Types.ObjectId(userId),
    });

    if (found) {
      return res.ok(found);
    }

    const {post, user} = await getUserAndPost(sid, userId.toString());
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

export async function update(req: Request, res: Response): Promise<void> {
  if (!req.params.id || !req.body.payload) {
    return res.badRequest();
  }

  try {
    await submissionModel.findByIdAndUpdate(new Types.ObjectId(req.params.id), req.body.payload)
    res.ok();
  } catch (error) {
    res.negotiate(error);
  }
};
