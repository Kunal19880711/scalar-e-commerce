import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../types";
import { HttpStatus, Roles } from "../../constants";

export function authorization(roles: Roles[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    try {
      const userInfo = req.requestInfo?.userInfo;
      if(!userInfo) {
        throw new ApiError(HttpStatus.Unauthorized);
      }
      const rolesStrVal: string[] = roles.map((role) => role.toString());
      if (!userInfo || !rolesStrVal.includes(userInfo.role)) {
        throw new ApiError(HttpStatus.Unauthorized);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
