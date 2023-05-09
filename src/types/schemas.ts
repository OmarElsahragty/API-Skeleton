import { z } from "zod";
import * as enums from "./enums";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  accessType: z.enum(enums.AccessTypes).optional(),
});

// ********************************* //

export const userSchema = authSchema.merge(z.object({ name: z.string() }));
