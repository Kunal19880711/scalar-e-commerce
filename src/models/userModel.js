const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password should be at least 8 characters long"],
    },
    confirmPassword: {
      type: String,
      required: true,
      minLength: 8,
      validate: [function () {
        return this.confirmPassword === this.password;
      }, "{VALUE} does not match with password"],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },

    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});

const roles = ["admin", "seller", "buyer"];

userSchema.pre("save", function (next) {
  const isPresent = roles.includes(this.role);
  if (!isPresent) {
    next(new Error("Role is not valid"));
  } else {
    next();
  }
});

userSchema.pre("findOne", function (next) {
  this.select("-password");
  next();
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = {
  UserModel,
};
