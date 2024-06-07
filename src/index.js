// const uri =
//   "mongodb+srv://user001:kPpMfmPBnJQpjX1f@cluster0.braqwrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { userRouter } = require("./routes/userRouter");
const { productRouter } = require("./routes/productRouter");

const app = express();
const { USERID, MONGODBPASSWORD, MONGOURL, APPNAME } = process.env;
const uri = `mongodb+srv://${USERID}:${MONGODBPASSWORD}@${MONGOURL}?retryWrites=true&w=majority&appName=${APPNAME}`;
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => console.log("Listening on port 3000"));
  })
  .catch((err) => {
    console.log(err);
  });
