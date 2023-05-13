import { MongoServerError } from "mongodb";

export const databaseErrorParser = (error: MongoServerError): undefined | string => {
  if (error.code === 11000) return "Duplicate key error. The record already exists.";
};
