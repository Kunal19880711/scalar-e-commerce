import {
  CallbackWithoutResultAndOptionalError,
  Connection,
  Document,
  Model,
  Schema
} from "mongoose";
import { getConnection } from "../connect";
import { Roles } from "../../../../constants";
import { Otp, hashPassword } from "../../../../appUtils";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phash?: string;
  role?: string;
  isVerified: boolean;
  accountVerificationOtp?: Otp;
  passwordRecoveryOtp?: Otp;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true, // "Email already exists"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password should be at least 8 characters long"],
      validate: [
        function (this: IUser) {
          return this.confirmPassword === this.password;
        },
        "{VALUE} does not match with confirmPassword",
      ],
    },
    confirmPassword: {
      type: String,
      required: true,
      minLength: 8,
    },
    phash: {
      type: String,
    },
    role: {
      type: String,
      default: Roles.Buyer,
      enum: Object.values(Roles),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationOtp: {
      otp: String,
      expiry: Date,
    },
    passwordRecoveryOtp: {
      otp: String,
      expiry: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.accountVerificationOtp;
        delete ret.passwordRecoveryOtp;
        delete ret.phash;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>("save", function (next) {
  this.phash = this.password ? hashPassword(this.password) : undefined;
  this.password = undefined;
  this.confirmPassword = undefined;
  next();
});

const connection: Connection = getConnection();

export const UserModel = connection.model<IUser>("UserModel", userSchema);

function updateUserModel(
  this: IUser,
  next: CallbackWithoutResultAndOptionalError
): void {
  this.phash = this.password ? hashPassword(this.password) : undefined;
  this.password = undefined;
  this.confirmPassword = undefined;
  next();
}
