const { Schema, model } = require("mongoose");

const productSchema = new Schema(
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
    // discount: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "discount cannot be negative"],
    //   validate: [
    //     function () {
    //       return this.discount <= this.price;
    //     },
    //     "discount cannot be greater than price",
    //   ],
    // },
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
  }
);

productSchema.set("toJSON", {
  virtuals: true,
});

exports.ProductModel = model("productModel", productSchema);