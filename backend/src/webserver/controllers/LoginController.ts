import { NextFunction, Response, Request } from "express";
import { controller, bodyValidator, post, get } from "./decorators";
import {
  ApiError,
  IRequestWithJsonBody,
  IUserInfo,
  ValidationErrorDetail,
} from "../types";
import { HttpStatus, Paths } from "../../constants";
import {
  JwtPayload,
  createJwtToken,
  hashPassword,
  envConfig,
  decrpyptJwtToken,
} from "../../appUtils";
import { IUser, UserModel } from "../../persistence";
import { respondSuccess } from "../webServerUtils";

const config = envConfig();
const cookieKey = config.SERVER_COOKIE_KEY;
const cookieMaxAge = Number.parseInt(config.SERVER_COOKIE_MAXAGE, 10);

export type LoginRequest = {
  email: string;
  password: string;
};

export type SsoLoginRequest = {
  token: string;
};

@controller(Paths.Auth)
export class LoginController {
  @post(Paths.Login)
  @bodyValidator("email", "password")
  async postLogin(
    req: IRequestWithJsonBody<LoginRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user: IUser | null = await UserModel.findOne<IUser>({ email });
      if (!user) {
        const apiError = new ApiError(
          HttpStatus.BadRequest,
          "User not found.",
          [new ValidationErrorDetail("email", ["User not found."])]
        );
        next(apiError);
        return;
      }

      const phash = hashPassword(password as string);
      if (user.phash != phash) {
        const apiError = new ApiError(HttpStatus.Unauthenticated, [
          new ValidationErrorDetail("password", ["Incorrect Password."]),
        ]);
        next(apiError);
        return;
      }

      if (!user.isVerified) {
        const apiError = new ApiError(
          HttpStatus.Unauthenticated,
          "User is not verified.",
          [new ValidationErrorDetail("email", ["User is not verified."])]
        );
        next(apiError);
        return;
      }

      const userInfo: IUserInfo = {
        id: user._id as string,
        email: user.email as string,
        role: user.role as string,
      };
      const token = await createJwtToken(userInfo);
      res.cookie(cookieKey, token, { maxAge: cookieMaxAge, httpOnly: true });

      const responseData = {
        user: userInfo,
        token: token,
      };
      respondSuccess(res, HttpStatus.OK, responseData, "Login successful");
    } catch (err: Error | any) {
      next(err);
    }
  }

  @post(Paths.SsoLogin)
  @bodyValidator("token")
  async postSsoLogin(
    req: IRequestWithJsonBody<SsoLoginRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      const payload: JwtPayload = await decrpyptJwtTokenHelper(token);
      const userInfo: IUserInfo = payload as IUserInfo;
      res.cookie(cookieKey, token, { maxAge: cookieMaxAge, httpOnly: true });

      const responseData = {
        user: userInfo,
        token: token,
      };
      respondSuccess(res, HttpStatus.OK, responseData, "Login successful");
    } catch (err: Error | any) {
      next(err);
    }
  }

  @get(Paths.Logout)
  getLogout(req: Request, res: Response): void {
    res.clearCookie(cookieKey);
    respondSuccess(res, HttpStatus.OK, {}, "Logout successful");
  }
}

export async function decrpyptJwtTokenHelper(
  token: string
): Promise<JwtPayload> {
  try {
    return await decrpyptJwtToken(token);
  } catch (err) {
    throw new ApiError(HttpStatus.Unauthenticated, "Invalid token", [
      new ValidationErrorDetail("token", ["Invalid token"]),
    ]);
  }
}
