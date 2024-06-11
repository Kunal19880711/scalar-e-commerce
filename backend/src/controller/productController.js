const { ProductModel } = require("../models/productModel");
const {
  getAllResources,
  getResourceById,
  createResource,
  deleteResourceById,
  updateResourceById,
} = require("../utils/resourceFactory");

// exports.getAllProducts = getAllResources(ProductModel);
// exports.getAllProducts = async (req, res) => {
//   try {
//     let dbQuery = ProductModel.find();

//     const { sort } = req.query || {};
//     if (sort) {
//       const [param, direction] = sort?.split("_") || [];
//       dbQuery = dbQuery.sort({ [param]: direction === "desc" ? -1 : 1 });
//     }

//     const { page, limit } = req.query || {};
//     if (page && limit) {
//       dbQuery = dbQuery
//         .skip((parseInt(page) - 1) * parseInt(limit))
//         .limit(parseInt(limit));
//     }

//     const data = await dbQuery;

//     if (data.length === 0) {
//       res.status(404).json({
//         message: "No products found",
//       });
//     } else {
//       res.status(200).json(data);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

exports.getAllProducts = getAllResources(ProductModel);
exports.getProductById = getResourceById(ProductModel);
exports.createProduct = createResource(ProductModel);
exports.deleteProductById = deleteResourceById(ProductModel);
exports.updateProductById = updateResourceById(ProductModel);
