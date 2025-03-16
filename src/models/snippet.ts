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

export interface TestCase {
  input: string;

  expectedOutput: string;
}

export interface SnippetInterface {
  examples: string[];

  title: string;

  description: string;

  template: string;

  user: string;

  difficulty: Difficulty;

  testCases?: TestCase[];
}


export interface SnippetDocument extends SnippetInterface, Document<Types.ObjectId> {};
export interface SnippetModelInterface extends Model<SnippetInterface> {};

const snippetDefinition: SchemaDefinition<SnippetInterface> = {
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

  testCases: {
    type: [{
      expectedOutput: String,
      input: String,
    }],
  },

  title: {
    required: true,
    type: String,
  },

  user: {
    ref: userModel.collection.name,
    required: true,
    type: String,
  },
};

const schema = new Schema<SnippetInterface, SnippetModelInterface>(snippetDefinition, {
  collection: 'snippet',
  timestamps: true,
});

export const snippetModel = model<SnippetInterface, SnippetModelInterface>('snippet', schema);
