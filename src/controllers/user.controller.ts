import { Request, Response, NextFunction } from "express";
import DefaultController from "./default.controller";
import { userService } from "../services";
import { UserInterface } from "../types";

class UserController extends DefaultController<UserInterface> {
  constructor() {
    super(userService);
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    return this.response(userService.authenticate(req.body.email, req.body.password), res, next);
  };
}

export default new UserController();
