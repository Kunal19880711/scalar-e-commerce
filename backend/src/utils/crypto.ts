import crypto from "crypto";
import jwt from "jsonwebtoken";
import { envConfig } from "./envConfig";

const config = envConfig();
const jwtSecret = config.SERVER_JWT_SECRET as string;

export type JwtPayload = string | Buffer | object;

export function createJwtToken(payload: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { algorithm: "HS256" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
}

export async function decrpyptJwtToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}
