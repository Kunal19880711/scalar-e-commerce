import crypto from "crypto";

import {
  CallbackWithoutResultAndOptionalError,
  Connection,
  Document,
  Model,
  Schema,
  model,
} from "mongoose";
import { getConnection } from "../connect";
import { Roles, Constants } from "../../../../constants";
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
    },
    confirmPassword: {
      type: String,
      required: true,
      minLength: 8,
      validate: [
        function (this: IUser) {
          return this.confirmPassword === this.password;
        },
        "{VALUE} does not match with password",
      ],
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
  { timestamps: true }
);

userSchema.pre<IUser>("save", function (next) {
  this.phash = this.password ? hashPassword(this.password) : undefined;
  this.password = undefined;
  this.confirmPassword = undefined;
  next();
});

// const roles = ["admin", "seller", "buyer"];

// userSchema.pre<IUser>("save", function (next) {
//   const isPresent = roles.includes(this.role as string);
//   if (!isPresent) {
//     next(new Error("Role is not valid"));
//   } else {
//     next();
//   }
// });

// userSchema.pre<IUser>("findOne", function (this: IUser, next) {
//   this.select("-password");
//   next();
// });

// userSchema.pre<IUser>("find", function (next) {
//   this.select("-password");
//   next();
// });

// userSchema.post<IUser>("save", function (err, doc, next) {
//   if (err.name === "MongoError" && err.code === 11000) {
//     console.log(err);
//     next(new Error("Email is already in registered"));
//   } else {
//     next();
//   }
// });

userSchema.set("toJSON", {
  virtuals: true,
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
