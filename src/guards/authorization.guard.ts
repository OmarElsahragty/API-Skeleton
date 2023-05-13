import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { UserInterface, ForbiddenException } from "../types";
import config from "../../config";

export default async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    const data = (await new Promise((resolve, reject): void | string | Partial<UserInterface> => {
      if (!token) return reject();

      if (token.includes("Bearer")) {
        return verify(token.replace("Bearer ", ""), config.jwt.secret, (err, result) =>
          err || !result ? reject() : resolve(result)
        );
      }
    }).catch(() => undefined)) as void | string | Partial<UserInterface>;

    const user =
      (typeof data === "string" || data?._id) &&
      (await userService.get(typeof data === "string" ? { id: data } : { filter: { _id: data._id } }));

    if (!user) throw new ForbiddenException();
    req.user = user;

    next();
  } catch (err) {
    return next(err);
  }
};
