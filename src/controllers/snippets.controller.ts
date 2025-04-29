import {SnippetDocument, snippetModel} from '../models/snippet';
import {Request, Response} from 'express';
import {Types} from 'mongoose';
import {submissionModel} from '../models/submission';
import {SnippetsPipelineBuilder} from '../lib/snippets.pipeline-builder';

export async function find(req: Request, res: Response): Promise<void> {
  try {
    const builder = new SnippetsPipelineBuilder(req.query ?? {});
    const pipeline = builder.build();

    const snippets = await snippetModel.aggregate(pipeline);
    res.ok(snippets);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function findById(req: Request, res: Response): Promise<void> {
  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const snippet = await snippetModel
      .findById<SnippetDocument>(new Types.ObjectId(req.params.id))
      .populate('user');

    if (!snippet) {
      return res.notFound();
    }

    res.ok(snippet);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function update(req: Request, res: Response): Promise<void> {
  if (!req.params.id || !req.body.payload) {
    return res.badRequest();
  }

  try {
    await submissionModel.findByIdAndUpdate<SnippetDocument>(new Types.ObjectId(req.params.id), req.body.payload)
    res.ok();
  } catch (error) {
    res.negotiate(error);
  }
};
