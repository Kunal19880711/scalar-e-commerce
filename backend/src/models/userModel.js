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
      unique: [true, "Email already exists"],
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
      validate: [
        function () {
          return this.confirmPassword === this.password;
        },
        "{VALUE} does not match with password",
      ],
    },
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

userSchema.pre("find", function (next) {
  this.select("-password");
  next();
});

userSchema.post("save", function (err, doc, next) {
  if (err.name === "MongoError" && err.code === 11000) {
    console.log(err);
    next(new Error("Email is already in registered"));
  } else {
    next();
  }
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = {
  UserModel,
};
