import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export default (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (err) {
    return next(err);
  }
};
