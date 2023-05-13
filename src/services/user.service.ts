import { sign } from "jsonwebtoken";
import DefaultService from "./default.service";
import { userRepository } from "../database/repositories";
import { getTokenDate } from "../helpers";
import { verifyHash } from "../libraries";
import { UserInterface, UnauthorizedException } from "../types";
import config from "../../config";

class UserService extends DefaultService<UserInterface> {
  constructor() {
    super(userRepository);
  }

  // ************** authentication ************** //
  authenticate = async (email: string, watchword: string): Promise<{ user: Partial<UserInterface>; token: string }> => {
    const user = await userRepository.findOne({ filter: { email, isDeleted: false } });
    if (!user || user.accessType === "DENIED" || !user.password || !(await verifyHash(user.password, watchword))) {
      throw new UnauthorizedException("Incorrect email or password");
    }

    delete user.password;

    return { user, token: `Bearer ${sign(getTokenDate(user), config.jwt.secret, { expiresIn: config.jwt.lifeTime })}` };
  };
}

export const userService = new UserService();
