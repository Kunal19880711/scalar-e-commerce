const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
} = require("../controller/userController");
const {
  payloadSanityMiddleware,
} = require("../middlewares/payloadSanityMiddleware");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getAllUsers)
  .post(payloadSanityMiddleware, createUser);
userRouter
  .route("/:id")
  .get(getUserById)
  .patch(payloadSanityMiddleware, updateUserById)
  .delete(deleteUserById);

exports.userRouter = userRouter;
