import DefaultRepository from "./default.repository";
import { UserInterface } from "../../types";
import { userModel } from "../models";

class UserRepository extends DefaultRepository<UserInterface> {
  constructor() {
    super(userModel);
  }
}

export const userRepository = new UserRepository();
