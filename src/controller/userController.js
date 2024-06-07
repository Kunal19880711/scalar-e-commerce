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

// async function getAllUsers(req, res) {
//   try {
//     console.log("Send data of all the users");
//     const userList = await UserModel.find();
//     if (userList.length === 0) {
//       res.status(404).json({
//         message: "No users found",
//       });
//     } else {
//       res.status(200).json({
//         message: "User data list",
//         data: userList,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// async function getUserById(req, res) {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findById(id);
//     if (!user) {
//       res.status(404).json({
//         message: "User not found",
//       });
//     } else {
//       res.status(200).json({
//         message: "User found",
//         data: user,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// async function createUser(req, res) {
//   try {
//     const newUser = req.body;
//     const user = await UserModel.create(newUser);
//     res.status(201).json({
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// async function deleteUserById(req, res) {
//   try {
//     const id = req.params.id;
//     const deletedUser = await UserModel.findOneAndDelete({ _id: id });
//     if (!deletedUser) {
//       res.status(404).json({
//         message: "User not found",
//       });
//     } else {
//       res.status(200).json({
//         message: "User deleted successfully",
//         data: deletedUser,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// async function getUserById(req, res) {
//   try {
//     const id = req.params.id;
//     const user = await UserModel.findById(id);
//     if (!user) {
//       res.status(404).json({
//         message: "User not found",
//       });
//     } else {
//       res.status(200).json({
//         message: "User found",
//         data: user,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }

// async function updateUserById(req, res) {
//   try {
//     const id = req.params.id;
//     const dataToBeUpdated = req.body;
//     const updatedUser = await UserModel.findByIdAndUpdate(id, dataToBeUpdated, {
//       returnDocument: "after",
//     });
//     if (!updatedUser) {
//       res.status(400).json({
//         message: "User could not be updated",
//       });
//     } else {
//       res.status(200).json({
//         message: "User updated successfully",
//         data: updatedUser,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// }
