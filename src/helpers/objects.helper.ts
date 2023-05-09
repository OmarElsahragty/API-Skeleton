import { flatten as unknownFlatten } from "flat";

export const parser = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const flatten = <T>(object: T): T => unknownFlatten(object);

export const removeUndefined = <T>(object: T): T => JSON.parse(JSON.stringify(object));
