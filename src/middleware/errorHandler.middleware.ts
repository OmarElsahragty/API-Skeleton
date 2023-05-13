import { ZodError } from "zod";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";
import { ResponseInterface, Exception } from "../types";
import config from "../../config";

export default (
  error: Exception | Exception[] | ZodError | MongoServerError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const response: ResponseInterface<void> = {};

  if (!Array.isArray(error) && !(error instanceof Exception)) error = new Exception(error);
  else if (Array.isArray(error)) error = error.map(item => (item instanceof Exception ? item : new Exception(item)));

  const status = Array.isArray(error)
    ? error.reduce((acc, item) => (item.status > acc ? item.status : acc), 0)
    : error.status;

  response.metadata = {
    errors: Array.isArray(error)
      ? error.map(({ status, message }) => ({ status, message }))
      : [{ message: error.message }],
  };

  return res.status(status).send(config.environment === "PRODUCTION" ? response : error);
};
