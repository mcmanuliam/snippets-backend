import {PostDocument, postModel} from '../models/post';
import {Request, Response} from 'express';
import {Types} from 'mongoose';
import {submissionModel} from '../models/submission';
import {PostPipelineBuilder} from '../lib/post.pipeline-builder';

export async function find(req: Request, res: Response): Promise<void> {
  try {
    const builder = new PostPipelineBuilder(req.query ?? {});
    const pipeline = builder.build();

    const posts = await postModel.aggregate(pipeline);
    res.ok(posts);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function findById(req: Request, res: Response): Promise<void> {
  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const post = await postModel
      .findById<PostDocument>(new Types.ObjectId(req.params.id))
      .populate('user');

    if (!post) {
      return res.notFound();
    }

    res.ok(post);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function update(req: Request, res: Response): Promise<void> {
  if (!req.params.id || !req.body.payload) {
    return res.badRequest();
  }

  try {
    await submissionModel.findByIdAndUpdate<PostDocument>(new Types.ObjectId(req.params.id), req.body.payload)
    res.ok();
  } catch (error) {
    res.negotiate(error);
  }
};
