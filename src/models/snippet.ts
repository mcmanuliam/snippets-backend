import {Document, model, Model, Schema, SchemaDefinition, Types} from 'mongoose';
import {userModel} from './user';

export enum Difficulty {
  PISS_TAKE = 'piss_take',
  BEGINNER = 'beginner',
  AMATEUR = 'amateur',
  SEMI_COMPITENT = 'semi_compitent',
  GETTING_TOUGH = 'getting_tough',
  CHALLENGING = 'challenging',
  HELL_ON_EARTH = 'hell_on_earth',
  IMPOSSIBLE = 'impossible'
}

export interface SnippetInterface {
  examples: string[];

  title: string;

  description: string;

  template: string;

  user: Types.ObjectId;

  difficulty: number;
}

export interface SnippetDocument extends SnippetInterface, Document<Types.ObjectId> {};
export interface SnippetModelInterface extends Model<SnippetInterface> {};

const snippetDefinition: SchemaDefinition = {
  description: {
    required: true,
    type: String,
  },

  difficulty: {
    enum: Difficulty,
    required: true,
    type: String,
  },

  examples: {
    required: true,
    type: [String],
  },

  template: {
    required: true,
    type: String,
  },

  title: {
    required: true,
    type: String,
  },

  user: {
    ref: userModel.collection.name,
    required: true,
    type: Types.ObjectId,
  },
};

const schema = new Schema<SnippetInterface, SnippetModelInterface>(snippetDefinition, {
  collection: 'snippet',
  timestamps: true,
});

export const snippetModel = model<SnippetInterface, SnippetModelInterface>('snippet', schema);
