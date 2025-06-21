import {postModel} from '../models/post';
import {Request, Response} from 'express';
import {PostPipelineBuilder, PostPipelinePopulateOpts} from '../lib/post.pipeline-builder';

export async function findDailyChallenge(req: Request, res: Response): Promise<void> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const post = await postModel.findOne({dailyChallenge: {
      $gte: startOfDay,
      $lte: endOfDay,
    }});

    res.ok(post);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function find(req: Request, res: Response): Promise<void> {
  try {
    const populate: PostPipelinePopulateOpts = {
      hot: true,
      owner: true,
    }

    const builder = new PostPipelineBuilder({...req.query, populate}, req.user?._id);
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
    const populate: PostPipelinePopulateOpts = {
      hot: true,
      owner: true,
    }

    const builder = new PostPipelineBuilder({_id: req.params.id, populate}, req.user?._id);
    const pipeline = builder.build();

    const [post] = await postModel.aggregate(pipeline);
    if (!post) {
      return res.notFound();
    }

    res.ok(post);
  } catch (error) {
    res.negotiate(error);
  }
};
