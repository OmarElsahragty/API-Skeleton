import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export default (
    schema: AnyZodObject,
    { source = "body", isArray = false }: { source?: "body" | "query" | "params"; isArray?: boolean } = {}
  ) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (isArray) await schema.array().parseAsync(req[source]);
      else await schema.parseAsync(req[source]);

      return next();
    } catch (err) {
      return next(err);
    }
  };
