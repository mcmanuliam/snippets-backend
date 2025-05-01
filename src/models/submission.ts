import {Document, model, Model, Schema, SchemaDefinition, Types} from 'mongoose';
import {userModel} from './user';
import {postModel} from './post';

enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
}

export interface CodeBlockInterface {
  language: string;

  code: string;
}

export interface SubmissionInterface {
  post: Types.ObjectId;

  user: Types.ObjectId;

  implementation: CodeBlockInterface;

  status: SubmissionStatus;
}


export interface SubmissionDocument extends SubmissionInterface, Document<Types.ObjectId> {};
export interface SubmissionModelInterface extends Model<SubmissionInterface> {};

const submissionDefinition: SchemaDefinition<SubmissionInterface> = {
  implementation: {
    type: Schema.Types.Mixed,
  },

  post: {
    ref: postModel.collection.name,
    required: true,
    type: Schema.Types.ObjectId,
  },

  status: {
    default: SubmissionStatus.DRAFT,
    enum: SubmissionStatus,
    type: String,
  },

  user: {
    ref: userModel.collection.name,
    required: true,
    type: Schema.Types.ObjectId,
  },
};

const schema = new Schema<SubmissionInterface, SubmissionModelInterface>(submissionDefinition, {
  collection: 'submission',
  timestamps: true,
});

export const submissionModel = model<SubmissionInterface, SubmissionModelInterface>('submission', schema);
