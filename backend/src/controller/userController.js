const { UserModel } = require("../models/userModel");
const {
  createResource,
  getAllResources,
  getResourceById,
  deleteResourceById,
  updateResourceById,
} = require("../utils/resourceFactory");

exports.getAllUsers = getAllResources(UserModel);
exports.getUserById = getResourceById(UserModel);
exports.createUser = createResource(UserModel);
exports.deleteUserById = deleteResourceById(UserModel);
exports.updateUserById = updateResourceById(UserModel);


