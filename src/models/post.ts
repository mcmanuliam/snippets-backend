import {Document, model, Model, Schema, SchemaDefinition, Types} from 'mongoose';
import {userModel} from './user';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  IMPOSSIBLE = 'impossible'
}

export interface SignatureInterface {
  code: string;

  language: number;
}

export interface PostInterface {
  title: string;

  image?: string;

  tags: string[];

  description: string;

  signature: SignatureInterface;

  user: Types.ObjectId;

  difficulty: Difficulty;

  dailyChallenge: Date;

  timeEstimate?: number;

  deleted?: boolean;

  official: boolean;
}

export interface PostDocument extends PostInterface, Document<Types.ObjectId> {};
export interface PostModelInterface extends Model<PostInterface> {};

const postDefinition: SchemaDefinition<PostInterface> = {
  dailyChallenge: {
    type: Date,
  },

  deleted: {
    type: Boolean,
  },

  description: {
    required: true,
    type: String,
  },

  difficulty: {
    enum: Difficulty,
    required: true,
    type: String,
  },

  image: {
    type: String,
  },

  official: {
    type: Boolean,
  },

  signature: {
    required: true,
    type: Schema.Types.Mixed,
  },

  tags: {
    default: [],
    required: true,
    type: Schema.Types.Mixed,
  },

  title: {
    required: true,
    type: String,
  },

  user: {
    ref: userModel.collection.name,
    required: true,
    type: Schema.Types.ObjectId,
  },
};

const schema = new Schema<PostInterface, PostModelInterface>(postDefinition, {
  collection: 'post',
  timestamps: true,
});

export const postModel = model<PostInterface, PostModelInterface>('post', schema);
