import {Request, Response} from 'express';
import {collectionModel} from '../models/collection';
import {Types} from 'mongoose';

export async function find(_req: Request, res: Response): Promise<void> {
  try {
    const collections = await collectionModel.find();
    res.ok(collections);
  } catch (error) {
    res.negotiate(error);
  }
};

export async function findById(req: Request, res: Response): Promise<void> {
  if (!req.params.id) {
    return res.badRequest();
  }

  try {
    const collection = await collectionModel.findById(new Types.ObjectId(req.params.id));
    if (!collection) {
      return res.notFound();
    }

    res.ok(collection);
  } catch (error) {
    res.negotiate(error);
  }
};
