import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import Exception, { badRequest, badData, internalServerError } from "../errors";
import { MongoError } from "mongodb";
import { logger } from "../libraries";
import config from "../../config";

export default (
  error: Exception | ZodError | MongoError | Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // ***********  Validation *********** //
  if (error instanceof ZodError) {
    return badData(error.errors.map(({ message }) => message).join(" & "));
  }

  // ***********  Duplicate key *********** //
  if (error instanceof MongoError && error.code === 11000) {
    error = badRequest(
      `${error.message
        .split("index: ")[1]
        .split("_")[0]
        .split("")
        .map(char => (/[A-Z]/.test(char) ? ` ${char.toLowerCase()}` : char))
        .join("")} already exist`
    );
  }

  if (error instanceof Exception && error?.output?.payload?.statusCode) {
    return res.status(error.output.payload.statusCode).send(error.output.payload);
  }

  logger.error(error);

  const internalError =
    config.environment === "PRODUCTION"
      ? internalServerError()
      : { output: { payload: { statusCode: 500, payload: error } } };

  return res.status(internalError.output.payload.statusCode).send(internalError.output.payload);
};
