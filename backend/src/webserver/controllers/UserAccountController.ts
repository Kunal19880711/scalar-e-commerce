import { Request, Response, NextFunction } from "express";
import { controller, del, patch, post } from "express-controller";

import {
  IAddress,
  ICartItem,
  IUser,
  IUserData,
  IUserInfo,
  UserDataModel,
  UserModel,
  addressMandatoryKeyPaths,
  notAllowDirectChangeKeyPaths,
} from "../../persistence";
import {
  ApiError,
  IRequestWithJsonBody,
  IValidationErrorDetail,
  ValidationErrorDetail,
} from "../types";

import {
  requireBodyValidator,
  requireDeleteKeyPaths,
  requireAuth,
} from "./decorators";
import { Constants, HttpStatus, Paths } from "../../constants";
import { Otp, generateOtp } from "../../appUtils";
import {
  ExtraOptions,
  changeQueryForExtraOptions,
  generateErrorDetails,
  respondSuccess,
  updateResourceById,
} from "../webServerUtils";
import { MailInfo, sendMail } from "../../communications";

const updateUserById = updateResourceById(UserModel);

export type VerifyAccountRequest = {
  email: string;
  otp: string;
};

export type ResendVerificationCodeRequest = {
  email: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  password: string;
  confirmPassword: string;
} & VerifyAccountRequest;

const UserNotFoundError = new ApiError(HttpStatus.NotFound, "User not found.", [
  new ValidationErrorDetail("email", ["User not found."]),
]);

const AccountDeletedError = new ApiError(
  HttpStatus.Unauthorized,
  "Your Account has been deleted."
);

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

      if (errorDetails.length > 0) {
        const apiError = new ApiError(HttpStatus.BadRequest, errorDetails);
        throw apiError;
      }

      user.isVerified = false;
      user.accountVerificationOtp = generateOtp(Constants.OtpLength);
      const savedUser = await user.save();

      const message = `Please check your email ${savedUser.email} to verify your account`;
      const mailInfo = await sendMailToVerifyAccount(
        savedUser,
        user.accountVerificationOtp
      );

      respondSuccess(res, HttpStatus.Created, user, message);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.ResendVerification)
  @requireBodyValidator("email")
  async resendVerificationCode(
    req: IRequestWithJsonBody<ResendVerificationCodeRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      let user = await UserModel.findOne({ email });
      if (!user) {
        throw UserNotFoundError;
      }

      if (user.isVerified) {
        throw new ApiError(HttpStatus.BadRequest, "User already verified", [
          new ValidationErrorDetail("email", ["User already verified."]),
        ]);
      }

      if (!user.accountVerificationOtp) {
        const otp = generateOtp(
          Constants.OtpLength,
          Constants.OtpLifeInSeconds
        );
        user = await UserModel.findByIdAndUpdate(
          user._id,
          {
            accountVerificationOtp: otp,
          },
          {
            returnDocument: "after",
          }
        );
        if (!user) {
          throw UserNotFoundError;
        }
      }

      const message = `Please check your email ${user.email} to verify your account`;
      const mailInfo = await sendMailToVerifyAccount(
        user,
        user.accountVerificationOtp as Otp
      );

      respondSuccess(res, HttpStatus.OK, user, message);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.VerifyAccount)
  @requireBodyValidator("email", "otp")
  async verifyAccount(
    req: IRequestWithJsonBody<VerifyAccountRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw UserNotFoundError;
      }

      const otpErrorDetail = verifyOtp(user.accountVerificationOtp, otp);
      if (otpErrorDetail) {
        throw new ApiError(HttpStatus.BadRequest, "Invalid OTP", [
          otpErrorDetail,
        ]);
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
        throw UserNotFoundError;
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
  @requireBodyValidator("email")
  async forgotPassword(
    req: IRequestWithJsonBody<ForgotPasswordRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw UserNotFoundError;
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
        throw UserNotFoundError;
      }
      const message = `Please check your email ${savedUser.email} to reset your password`;
      const mailInfo = await sendMailToResetPassword(savedUser, otp);
      respondSuccess(res, HttpStatus.OK, savedUser, message);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.ResetPassword)
  @requireBodyValidator("email", "otp", "password", "confirmPassword")
  async resetPassword(
    req: IRequestWithJsonBody<ResetPasswordRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp, password, confirmPassword } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw UserNotFoundError;
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
        throw new ApiError(HttpStatus.BadRequest, "Invalid OTP", errorDetails);
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
        throw UserNotFoundError;
      }
      const message = "Password reset successfully";
      respondSuccess(res, HttpStatus.OK, savedUser, message);
    } catch (err) {
      next(err);
    }
  }

  @patch(Paths.EMPTY)
  @requireAuth()
  @requireDeleteKeyPaths(...notAllowDirectChangeKeyPaths)
  async updateOwnAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userInfo = req?.requestInfo?.userInfo as IUserInfo;
      req.params.id = userInfo.userId.toString();
      return await updateUserById(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.Address)
  @requireAuth()
  @requireBodyValidator(...addressMandatoryKeyPaths)
  async addAddress(
    req: IRequestWithJsonBody<IAddress>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req);
      const newAddress = req.body as IAddress;
      userData.addresses = userData.addresses || [];
      userData.addresses.splice(0, 0, newAddress);
      const savedUSer = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        savedUSer,
        "Address added successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @patch(Paths.Address + Paths.ID)
  @requireAuth()
  async updateAddress(
    req: IRequestWithJsonBody<IAddress>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      const userObj = userData.toObject();
      userData.addresses = userData.addresses || [];

      const addressIndex = userData.addresses.findIndex(
        (address: IAddress) => address.id.toString() === id
      );

      if (addressIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Address not found");
      }

      userData.addresses[addressIndex] = {
        ...(userObj.addresses as IAddress[])[addressIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      const updatedUser = await userData.save();

      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Address updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @del(Paths.Address + Paths.ID)
  @requireAuth()
  async deleteAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      const userObj = userData.toObject();
      userData.addresses = userData.addresses || [];

      const addressIndex = userData.addresses.findIndex(
        (address: IAddress) => address.id.toString() === id
      );

      if (addressIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Address not found");
      }

      userData.addresses.splice(addressIndex, 1);
      const updatedUser = await userData.save();

      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Address deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @post(Paths.Cart)
  @requireAuth()
  async addCartItem(
    req: IRequestWithJsonBody<ICartItem>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await getUserData(req);
      userData.cart = userData.cart || [];
      userData.cart.push(req.body);
      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item added successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @patch(Paths.Cart + Paths.ID)
  @requireAuth()
  async updateCartItem(
    req: IRequestWithJsonBody<ICartItem>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req, { populate: ["cart.product"] });
      const userObj = userData.toObject();
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem.id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      const updatedCartItem: ICartItem = {
        ...userObj.cart[cartItemIndex],
        ...req.body,
        updatedAt: new Date(),
      };

      userData.cart[cartItemIndex] = updatedCartItem;

      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item modified successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  @del(Paths.Cart + Paths.ID)
  @requireAuth()
  async deleteCartItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      const userData = await getUserData(req);
      userData.cart = userData.cart || [];
      const cartItemIndex = userData.cart.findIndex(
        (cartItem: ICartItem) => cartItem.id.toString() === id
      );

      if (cartItemIndex === -1) {
        throw new ApiError(HttpStatus.BadRequest, "Cart item not found.");
      }

      userData.cart.splice(cartItemIndex, 1);
      const updatedUser = await userData.save();
      respondSuccess(
        res,
        HttpStatus.OK,
        updatedUser,
        "Cart item deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

function verifyOtp(
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

async function sendMailToVerifyAccount(
  user: IUser,
  otp: Otp
): Promise<MailInfo> {
  const message = /*html*/ `
  <h1>Welcome to our platform!</h1>
  <p>Dear ${user.name},</p>
  <p>Thank you for joining our platform. We are excited to have you on board!</p>
  <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
  <p/>
  <p>Please use the following OTP to verify your account:</p>
  <p>${otp.otp}</p>
  <p/>
  <p>Thank you,</p>
  <p>Best regards,</p>
  <p>Your Platform Team</p>
  `;
  const mailOps = {
    to: user.email,
    subject: "Verify your account",
    text: "Verify your account",
    html: message,
  };
  return sendMail(mailOps);
}

async function sendMailToResetPassword(
  user: IUser,
  otp: Otp
): Promise<MailInfo> {
  const message = /*html*/ `
  <h1>Reset your password</h1>
  <p>Dear ${user.name},</p>
  <p>Please use the following OTP to reset your password:</p>
  <p>${otp.otp}</p>
  <p/>
  <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
  <p/>
  <p>Thank you,</p>
  <p>Best regards,</p>
  <p>Your Platform Team</p>
  `;
  const mailOps = {
    to: user.email,
    subject: "Reset your password",
    text: "Reset your password",
    html: message,
  };
  return sendMail(mailOps);
}

async function getUserData(
  req: Request,
  extraOptions?: ExtraOptions
): Promise<IUserData> {
  const userInfo = req?.requestInfo?.userInfo as IUserInfo;
  let query = UserDataModel.findOne({ userId: userInfo.userId });
  query = changeQueryForExtraOptions(query, extraOptions);
  const userData = await query;
  if (!userData) {
    throw AccountDeletedError;
  }
  return userData;
}
