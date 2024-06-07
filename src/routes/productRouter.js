const express = require("express");

const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
} = require("../controller/productController");
const {
  payloadSanityMiddleware,
} = require("../middlewares/payloadSanityMiddleware");

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getAllProducts)
  .post(payloadSanityMiddleware, createProduct);
productRouter
  .route("/:id")
  .get(getProductById)
  .patch(payloadSanityMiddleware, updateProductById)
  .delete(deleteProductById);

exports.productRouter = productRouter;
