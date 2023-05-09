import { hash, verify } from "argon2";

export const createHash = async (text: string) => hash(text);

export const verifyHash = (hashed: string, text: string) => verify(hashed, text);
