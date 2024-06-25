import { NextFunction, Request, RequestHandler, Response } from "express";
import {IUserInfo} from '../../persistence'
import { JwtPayload, decryptJwtToken, envConfig } from "../../appUtils";
import { ApiError } from "../types";
import { HttpStatus, Roles } from "../../constants";

const config = envConfig();

export function authMiddleware(roles?: Roles[]): RequestHandler {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies[config.SERVER_COOKIE_KEY];
      if (!token) {
        throw new ApiError(HttpStatus.Unauthenticated);
      }
      const payload = await decryptJwtTokenHelper(token);
      const userInfo: IUserInfo = payload as IUserInfo;
      req.requestInfo = req.requestInfo || {};
      req.requestInfo.userInfo = userInfo;

      // is role check needed
      if (Array.isArray(roles) && roles.length > 0) {
        const rolesStrVal: string[] = roles.map((role) => role.toString());
        if (!userInfo || !rolesStrVal.includes(userInfo.role)) {
          throw new ApiError(HttpStatus.Unauthorized);
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

export async function decryptJwtTokenHelper(
  token: string
): Promise<JwtPayload> {
  try {
    return await decryptJwtToken(token);
  } catch (err) {
    throw new ApiError(HttpStatus.Unauthenticated);
  }
}
