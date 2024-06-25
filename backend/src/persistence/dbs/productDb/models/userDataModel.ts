import {
  Connection,
  Document,
  Model,
  Schema,
  SchemaDefinition,
  Types,
} from "mongoose";
import { getConnection } from "../connect";
import { IProduct, productModelName } from "./productModel";

export enum UserType {
  Local = "local",
  Sso = "sso",
}

export interface ICartItem {
  id: Types.ObjectId;
  product: Types.ObjectId | IProduct;
  quantity: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
  id: Types.ObjectId;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserInfo {
  userId: string | Types.ObjectId;
  email: string;
  role: string;
  userType: UserType;
}

export interface IUserData extends Document, IUserInfo {
  cart?: ICartItem[];
  addresses?: IAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userInfoSchemaDefination: SchemaDefinition = {
  userId: {
    type: Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

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

const userDataSchemaDefination: SchemaDefinition = {
  ...userInfoSchemaDefination,
  cart: {
    type: [cartSchemaDefination],
    default: [],
  },
  addresses: {
    type: [addressSchemaDefination],
    default: [],
  },
};

const userDataSchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
  },
};

const userSchema: Schema = new Schema<IUserData, Model<IUserData>>(
  userDataSchemaDefination,
  userDataSchemaOptions
);

userSchema.pre<IUserData>("save", function (next) {
  if (this.cart) {
    this.cart.forEach((cartItem: ICartItem) => {
      cartItem.total = cartItem.quantity * cartItem.product.price;
    });
  }
  next();
});

const connection: Connection = getConnection();

export const addressMandatoryKeyPaths = getMandatoryPaths(
  addressSchemaDefination as { [key: string]: MaybeMandatory }
);
export const cartMandatoryKeyPaths = getMandatoryPaths(
  cartSchemaDefination as { [key: string]: MaybeMandatory }
);

export const userDataModelName = "UserDataModel";
export const UserDataModel = connection.model<IUserData>(
  userDataModelName,
  userSchema
);

type MaybeMandatory = {
  required?: boolean;
};

function getMandatoryPaths(obj: { [key: string]: MaybeMandatory }): string[] {
  return Object.keys(obj).filter((key) => obj[key].required);
}
