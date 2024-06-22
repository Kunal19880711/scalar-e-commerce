import { Response, NextFunction } from "express";
import { IUser, UserModel } from "../../persistence";
import {
  ApiError, IRequestWithJsonBody,
  IValidationErrorDetail,
  ValidationErrorDetail
} from "../types";

import { controller, post, bodyValidator } from "./decorators";
import { Constants, HttpStatus, Paths } from "../../constants";
import { Otp, generateOtp, isInEnumList } from "../../appUtils";
import { generateErrorDetails, respondSuccess } from "../webServerUtils";

export type VerifyAccountRequest = {
  email: string;
  otp: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  password: string;
  confirmPassword: string;
} & VerifyAccountRequest;

@controller(Paths.AccountApi)
export class UserAccountController {
  @post(Paths.EMPTY)
  async signup(
    req: IRequestWithJsonBody<IUser>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = new UserModel(req.body);
      const errorDetails = generateErrorDetails(user.validateSync());

      if (user.role && !isInEnumList(user.role, Constants.SignUpRolesAllowed)) {
        errorDetails.push(new ValidationErrorDetail("role", ["Invalid role"]));
      }

      if (errorDetails.length > 0) {
        const apiError = new ApiError(HttpStatus.BadRequest, errorDetails);
        next(apiError);
        return;
      }

      user.isVerified = false;
      user.accountVerificationOtp = generateOtp(Constants.OtpLength);
      console.log(user.accountVerificationOtp);
      const savedUser = await user.save();
      const message = `Please check your email ${savedUser.email} to verify your account`;
      respondSuccess(res, HttpStatus.Created, savedUser, message);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.VerifyAccount)
  @bodyValidator("email", "otp")
  async verifyAccount(
    req: IRequestWithJsonBody<VerifyAccountRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }

      const otpErrorDetail = verifyOtp(user.accountVerificationOtp, otp);
      if (otpErrorDetail) {
        next(
          new ApiError(HttpStatus.BadRequest, "Invalid OTP", [otpErrorDetail])
        );
        return;
      }

      const savedUser: IUser | null = await UserModel.findByIdAndUpdate(
        user._id,
        {
          isVerified: true,
          $unset: {
            accountVerificationOtp: "",
          },
        },
        {
          returnDocument: "after",
        }
      );
      if (!savedUser) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }
      respondSuccess(
        res,
        HttpStatus.OK,
        savedUser,
        "Account verified successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.ForgotPassword)
  @bodyValidator("email")
  async forgotPassword(
    req: IRequestWithJsonBody<ForgotPasswordRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }

      const otp = generateOtp(Constants.OtpLength, Constants.OtpLifeInSeconds);
      const savedUser: IUser | null = await UserModel.findByIdAndUpdate(
        user._id,
        {
          passwordRecoveryOtp: otp,
        },
        {
          returnDocument: "after",
        }
      );
      if (!savedUser) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }
      const message = `Please check your email ${savedUser.email} to reset your password`;
      respondSuccess(res, HttpStatus.OK, savedUser, message);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.ResetPassword)
  @bodyValidator("email", "otp", "password", "confirmPassword")
  async resetPassword(
    req: IRequestWithJsonBody<ResetPasswordRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp, password, confirmPassword } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }

      const errorDetails: IValidationErrorDetail[] = [];
      const otpErrorDetail = verifyOtp(user.passwordRecoveryOtp, otp);
      if (otpErrorDetail) {
        errorDetails.push(otpErrorDetail);
      }
      if (password !== confirmPassword) {
        errorDetails.push(
          new ValidationErrorDetail("confirmPassword", [
            "Passwords do not match.",
          ])
        );
      }

      if (errorDetails.length > 0) {
        next(new ApiError(HttpStatus.BadRequest, "Invalid OTP", errorDetails));
        return;
      }

      const savedUser: IUser | null = await UserModel.findByIdAndUpdate(
        user._id,
        {
          phash: user.phash,
          $unset: {
            passwordRecoveryOtp: "",
          },
        },
        {
          returnDocument: "after",
        }
      );
      if (!savedUser) {
        next(
          new ApiError(HttpStatus.NotFound, "User not found", [
            new ValidationErrorDetail("email", ["User not found."]),
          ])
        );
        return;
      }
      const message = "Password reset successfully";
      respondSuccess(res, HttpStatus.OK, savedUser, message);
    } catch (err) {
      next(err);
    }
  }
}

export function verifyOtp(
  otp: Otp | undefined,
  otpToVerify: string
): ValidationErrorDetail | null {
  let otpErrorDetail: IValidationErrorDetail | null = null;

  if (!otp) {
    otpErrorDetail = new ValidationErrorDetail("otp", [
      "Please generate OTP first.",
    ]);
  } else if (otp.otp !== otpToVerify) {
    otpErrorDetail = new ValidationErrorDetail("otp", ["Invalid OTP."]);
  } else if (otp.expiry !== undefined && otp.expiry < new Date()) {
    otpErrorDetail = new ValidationErrorDetail("otp", ["OTP expired."]);
  }

  return otpErrorDetail;
}
