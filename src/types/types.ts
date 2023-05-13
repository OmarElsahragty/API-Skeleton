import { z, ZodError } from "zod";
import { ProjectionType } from "mongoose";
import { MongoServerError } from "mongodb";
import { fromZodError } from "zod-validation-error";
import { databaseErrorParser } from "../helpers";
import { logger } from "../libraries";
import * as schemas from "./schemas";

/* eslint-disable no-use-before-define */

declare module "express-serve-static-core" {
  interface Request {
    user?: UserInterface;
  }
}

// ********************************* //

export class Exception extends Error {
  public status = 500;
  public message = "An error occurred. Please try again later.";

  constructor(public error?: Error | ZodError | MongoServerError) {
    super();

    if (!error) return;

    if (this.error instanceof ZodError) {
      this.status = 400;
      this.message = fromZodError(this.error).message;
      return;
    }

    if (error.name === "MongoServerError") {
      const parsedMongoErrorMessage = databaseErrorParser(error as MongoServerError);
      if (!parsedMongoErrorMessage) return;
      this.status = 400;
      this.message = parsedMongoErrorMessage;
      return;
    }

    logger.error(error);
  }
}

export class NotFoundException extends Exception {
  constructor(message = "Not Found") {
    super();
    this.status = 404;
    this.message = message;
  }
}

export class UnauthorizedException extends Exception {
  constructor(message = "Unauthorized") {
    super();
    this.status = 401;
    this.message = message;
  }
}

export class ForbiddenException extends Exception {
  constructor(message = "Forbidden") {
    super();
    this.status = 403;
    this.message = message;
  }
}

interface EntityInformationInterface {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface IntervalInterface {
  filed: string;
  minimum?: number;
  maximum?: number;
}

export interface QueryOptionsInterface<T> {
  id?: string;
  filter?: Partial<T>;
  intervals?: IntervalInterface[];
  options?: { flattenQuery?: boolean; operation?: "and" | "or"; falsy?: boolean };
}

export interface ListInterface<T> {
  data: Partial<T>[];
  totalCount: number;
}

export interface ListOptionsInterface<T> {
  page?: number;
  pageLimit?: number;
  sortBy?: string;
  sortDirection?: 1 | -1;
  showAll?: boolean;
  projection?: ProjectionType<T>;
}

export interface ResponseInterface<T> {
  data?: T | T[];
  metadata?: { errors: { status?: number; message: string; error?: Exception | ZodError | MongoServerError }[] };
}

// ********************************* //

export interface UserInterface extends EntityInformationInterface, z.infer<typeof schemas.userSchema> {}
