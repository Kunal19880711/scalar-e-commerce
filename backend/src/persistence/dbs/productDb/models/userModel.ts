import {
  CallbackWithoutResultAndOptionalError,
  Connection,
  Document,
  Model,
  Schema,
  SchemaDefinition,
  Types,
} from "mongoose";
import { getConnection } from "../connect";
import { Roles } from "../../../../constants";
import { Otp, hashPassword } from "../../../../appUtils";
import { IProduct, productModelName } from "./productModel";

export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
  _id: Types.ObjectId;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
  cart?: ICartItem[];
  addresses?: IAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

const addressSchemaDefination: SchemaDefinition = {
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

const cartSchemaDefination: SchemaDefinition = {
  product: {
    type: Types.ObjectId,
    ref: productModelName,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};

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
    // required: true,
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
    // required: true,
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
  cart: {
    type: [cartSchemaDefination],
    default: [],
  },
  addresses: {
    type: [addressSchemaDefination],
    default: [],
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

export const notAllowDirectChangeKeyPaths = [
  "role",
  "isVerified",
  "phash",
  "accountVerificationOtp",
  "passwordRecoveryOtp",
  "cart",
  "addresses",
];
export const addressMandatoryKeyPaths = getMandatoryPaths(
  addressSchemaDefination as { [key: string]: MaybeMandatory }
);
export const cartMandatoryKeyPaths = getMandatoryPaths(
  cartSchemaDefination as { [key: string]: MaybeMandatory }
);
export const userModelName = "UserModel";
export const UserModel = connection.model<IUser>(userModelName, userSchema);

type MaybeMandatory = {
  required?: boolean;
};

function getMandatoryPaths(obj: { [key: string]: MaybeMandatory }): string[] {
  return Object.keys(obj).filter((key) => obj[key].required);
}
