import { Connection, Document, Model, Schema, Types } from "mongoose";
import { getConnection } from "../connect";
import { IUser, userModelName } from "./userModel";
import { IProduct, productModelName } from "./productModel";

export enum PaymentStatus {
  Pending = "Pending",
  Success = "Success",
  Failed = "Failed",
}

export enum DeliveryStatus {
  Pending = "Pending",
  Shipped = "Shipped",
  Delivered = "Delivered",
}

export interface IOrder extends Document {
  user?: Types.ObjectId | IUser;
  product?: Types.ObjectId | IProduct;
  quantity?: number;
  price?: number;
  total?: number;
  paymentOrderId?: string;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder, Model<IOrder>>(
  {
    user: {
      type: Types.ObjectId,
      ref: userModelName,
      required: true,
    },
    product: {
      type: Types.ObjectId,
      ref: productModelName,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
    paymentOrderId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    deliveryStatus: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.Pending,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

orderSchema.pre<IOrder>("save", function (next) {
  this.total = (this.price || 0) * (this.quantity || 0);
  next();
});

const connection: Connection = getConnection();

export const orderModelName = "orderModel";
export const OrderModel = connection.model(orderModelName, orderSchema);
