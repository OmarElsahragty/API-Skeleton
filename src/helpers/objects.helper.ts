import { flatten as unknownFlatten } from "flat";

export const parser = <T = string>(text?: string): T | undefined => {
  if (!text) return;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

export const flatten = <T>(object: T): T => unknownFlatten(object);

export const removeUndefined = <T>(object: T): T => JSON.parse(JSON.stringify(object)) as T;
