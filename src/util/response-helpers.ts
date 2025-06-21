import {Response} from 'express';
import express from 'express';
import HttpStatusCode from './http-status';

export interface StatusError extends Error {
  statusCode?: number;
}

const enum ErrorMessages {
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  SUCCESS = 'Success',
  BAD_REQUEST = 'Bad Request',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export function responseHelpers(): void {
  express.response.ok = function (
    this: Response,
    data: unknown,
  ): void {
    this.status(HttpStatusCode.OK).json(data ?? null);
  };

  express.response.negotiate = function (this: Response, error: StatusError): void {
    const status = error?.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = error?.message || ErrorMessages.INTERNAL_SERVER_ERROR;

    this.status(status).json({error: message});
  };

  express.response.unauthorized = function (
    this: Response,
    message: string = ErrorMessages.UNAUTHORIZED,
  ): void {
    this.status(HttpStatusCode.UNAUTHORIZED).send(message);
  };

  express.response.notFound = function (
    this: Response,
    message: string = ErrorMessages.NOT_FOUND,
  ): void {
    this.status(HttpStatusCode.NOT_FOUND).send(message);
  };

  express.response.badRequest = function (
    this: Response,
    message: string = ErrorMessages.BAD_REQUEST,
  ): void {
    this.status(HttpStatusCode.BAD_REQUEST).send(message);
  };

  express.response.error = function (
    this: Response,
    message: string = ErrorMessages.INTERNAL_SERVER_ERROR,
  ): void {
    this.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(message);
  };
}