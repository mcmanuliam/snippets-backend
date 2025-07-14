import {Document, model, Model, Schema, SchemaDefinition, Types} from 'mongoose';

export interface CollectionInterface {
  name: string;

  posts: Types.ObjectId[];

  image: string;

  owner: Types.ObjectId;

  isPublic: boolean;

  official: boolean;
}


export interface CollectionDocument extends CollectionInterface, Document<Types.ObjectId> {};
export interface CollectionModelInterface extends Model<CollectionInterface> {};

const postDefinition: SchemaDefinition<CollectionInterface> = {
  image: {
    type: String,
  },

  isPublic: {
    type: Boolean,
  },

  name: {
    required: true,
    type: String,
  },

  official: {
    type: Boolean,
  },

  owner: {
    ref: 'user',
    type: Schema.Types.ObjectId,
  },

  posts: [{
    ref: 'post',
    required: true,
    type: Schema.Types.ObjectId,
  }],
}

const schema = new Schema<CollectionInterface, CollectionModelInterface>(postDefinition, {
  collection: 'collection',
  timestamps: true,
});

export const collectionModel = model<CollectionInterface, CollectionModelInterface>('collection', schema);
