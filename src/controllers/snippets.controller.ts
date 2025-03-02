import {SnippetDocument, snippetModel} from '../models/snippet';
import {Request, Response} from 'express';
import {Types} from 'mongoose';

export async function find(req: Request, res: Response): Promise<void> {
  try {
    const snippets = await snippetModel.find<SnippetDocument>(req.query ?? {})

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
