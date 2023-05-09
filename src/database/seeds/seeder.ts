import * as repositories from "../repositories";

export const seeder = async () => {
  // ***********  users *********** //
  await repositories.userRepository.create({
    name: "admin",
    email: "admin@email.com",
    password: "admin",
    accessType: "ADMIN",
  });
};
