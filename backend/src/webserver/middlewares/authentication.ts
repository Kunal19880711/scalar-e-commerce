import { Response, NextFunction, RequestHandler, Request } from "express";
import { JwtPayload, decryptJwtToken, envConfig } from "../../appUtils";
import { ApiError, IRequestWithJsonBody, IUserInfo } from "../types";
import { HttpStatus } from "../../constants";

const config = envConfig();

export const authentication: RequestHandler = async function authentication(
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
    next();
  } catch (err) {
    next(err);
  }
};

export async function decryptJwtTokenHelper(
  token: string
): Promise<JwtPayload> {
  try {
    return await decryptJwtToken(token);
  } catch (err) {
    throw new ApiError(HttpStatus.Unauthenticated);
  }
}
