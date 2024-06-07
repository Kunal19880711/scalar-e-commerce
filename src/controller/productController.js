const { ProductModel } = require("../models/productModel");
const {
  getAllResources,
  getResourceById,
  createResource,
  deleteResourceById,
  updateResourceById,
} = require("../utils/resourceFactory");

exports.getAllProducts = getAllResources(ProductModel);
exports.getProductById = getResourceById(ProductModel);
exports.createProduct = createResource(ProductModel);
exports.deleteProductById = deleteResourceById(ProductModel);
exports.updateProductById = updateResourceById(ProductModel);
