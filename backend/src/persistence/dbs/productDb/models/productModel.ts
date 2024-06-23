import { Connection, Document, Model, Schema } from "mongoose";
import { getConnection } from "../connect";

export interface IProduct extends Document {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct, Model<IProduct>>(
  {
    title: {
      type: String,
      required: [true, "product title is required"],
      minLength: [4, "product title must be at least 4 characters"],
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      min: [0, "price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minLength: [10, "product description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "product category is required"],
      default: "Miscellaneous",
    },
    image: {
      type: String,
      required: [true, "product image is required"],
      default: "https://picsum.photos/id/26/300/200",
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

const connection: Connection = getConnection();

export const ProductModel = connection.model("productModel", productSchema);
