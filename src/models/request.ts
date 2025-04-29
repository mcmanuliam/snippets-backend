import {Document, Model, model, Schema, SchemaDefinition, Types} from 'mongoose';
import {loggingConfig} from '../config/logging.config';
import {userModel} from './user';

export interface RequestInterface {
  timestamp: Date

  message: String,

  method: String,

  url: String,

  statusCode: Number,

  responseTime: Number,

  ip?: String,

  userAgent?: String,

  stack?: String

  user?: Types.ObjectId;
}

export interface RequestDocument extends RequestInterface, Document<Types.ObjectId> {};
export interface RequestModelInterface extends Model<RequestInterface> {};

const definition: SchemaDefinition = {
  ip: {
    required: false,
    type: String,
  },

  message: {
    type: String,
  },

  method: {
    type: String,
  },

  responseTime: {
    type: Number,
  },

  stack: {
    required: false,
    type: String,
  },

  statusCode: {
    type: Number,
  },

  timestamp: {
    default: Date.now,
    type: Date,
  },

  url: {
    type: String,
  },

  user: {
    ref: userModel.collection.name,
    type: Types.ObjectId,
  },

  userAgent: {
    required: false,
    type: String,
  },
};

const schema = new Schema<RequestInterface, RequestModelInterface>(definition, {
  collection: 'request',
  timestamps: true,
});

schema.index({timestamp: 1}, {expireAfterSeconds: loggingConfig.logExpiry});

export const requestModel = model<RequestInterface, RequestModelInterface>('request', schema);
