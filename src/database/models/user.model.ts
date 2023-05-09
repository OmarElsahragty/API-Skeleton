import { Schema, model } from "mongoose";
import { createHash } from "../../libraries";
import { schemas } from "../../../constants";
import { UserInterface, AccessTypes } from "../../types";

const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, trim: true, required: true },
    accessType: { type: String, enum: AccessTypes, required: false, default: "DENIED" },
    isDeleted: { type: Boolean, default: false, required: false },
  },
  { timestamps: true, versionKey: false }
)
  .index({ name: 1 })
  .index({ email: 1 })
  .index({ accessType: 1 })
  .index({ isDeleted: 1 });

// ************** hash ************** //

userSchema.pre("findOneAndUpdate", async function (next) {
  const data = this.getUpdate() as UserInterface;
  if (data?.password) data.password = await createHash(data.password);
  this.setUpdate(data);
  next();
});

export const userModel = model<UserInterface>(schemas.users, userSchema);
