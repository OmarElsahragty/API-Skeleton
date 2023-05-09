import { z } from "zod";
import { ProjectionType } from "mongoose";
import * as schemas from "./schemas";

/* eslint-disable no-use-before-define */

declare module "express-serve-static-core" {
  interface Request {
    user?: UserInterface;
  }
}

// ********************************* //

interface EntityInformationInterface {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface QueryOptionsInterface<T> {
  id?: string;
  filter?: Partial<T>;
  intervals?: { filed: string; minimum?: number; maximum?: number }[];
  options?: { flattenQuery?: boolean; operation?: "and" | "or" };
}

export interface ListInterface<T> {
  data: Partial<T>[];
  totalCount: number;
}

export interface ListOptionsInterface<T> {
  page?: number;
  pageLimit?: number;
  sortBy?: string;
  sortDirection?: 1 | -1;
  showAll?: boolean;
  projection?: ProjectionType<T>;
}

// ********************************* //

export interface UserInterface extends EntityInformationInterface, z.infer<typeof schemas.userSchema> {}
