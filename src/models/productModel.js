const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "product name must be at least 4 characters"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "discount cannot be negative"],
      validate: [
        function () {
          return this.discount <= this.price;
        },
        "discount cannot be greater than price",
      ],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "product description must be at least 10 characters"],
    },
    brand: String,
    category: {
      type: String,
      required: true,
      default: "Miscellaneous",
    },
  },
  {
    timestamps: true,
  }
);

exports.ProductModel = model("productModel", productSchema);
