import {Document, Model, model, Schema, SchemaDefinition, Types} from 'mongoose';

export interface UserInterface {
  providerId: string;

  provider: string;

  username: string;

  avatar: string;

  title: string;

  refresh: string | undefined;
}

export interface UserDocument extends UserInterface, Document<Types.ObjectId> {};
export interface UserModelInterface extends Model<UserInterface> {};

const definition: SchemaDefinition = {
  avatar: {
    type: String,
  },

  provider: {
    type: String,
  },

  providerId: {
    required: true,
    type: String,
    unique: true,
  },

  refresh: {
    select: false,
    type: String,
  },

  title: {
    type: String,
  },

  username: {
    type: String,
  },
};

const schema = new Schema<UserInterface, UserModelInterface>(definition, {
  collection: 'user',
  timestamps: true,
});

export const userModel = model<UserInterface, UserModelInterface>('user', schema);
