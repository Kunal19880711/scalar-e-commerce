import {
  Connection,
  Document,
  Model,
  Schema,
  SchemaDefinition,
} from "mongoose";
import { getConnection } from "../connect";
import { Roles } from "../../../../constants";
import { Otp, hashPassword } from "../../../../appUtils";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  isVerified: boolean;
  accountVerificationOtp?: Otp;
  passwordRecoveryOtp?: Otp;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchemaDefination: SchemaDefinition = {
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
};

const userSchema: Schema = new Schema<IUser, Model<IUser>>(
  userSchemaDefination,
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.accountVerificationOtp;
        delete ret.passwordRecoveryOtp;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre<IUser>("save", async function (next) {
  this.password = this.password ? await hashPassword(this.password) : undefined;
  this.confirmPassword = undefined;
  next();
});

const connection: Connection = getConnection();

export const notAllowDirectChangeKeyPaths = [
  "role",
  "isVerified",
  "phash",
  "accountVerificationOtp",
  "passwordRecoveryOtp",
  "cart",
  "addresses",
];

export const userModelName = "UserModel";
export const UserModel = connection.model<IUser>(userModelName, userSchema);
