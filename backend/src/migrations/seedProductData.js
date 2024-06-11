const ProductModel = require("../models/productModel");
const products = require("../../json/products.json");

async function seedProductData(model, entries) {
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");

  dotenv.config();
  const { USERID, MONGODBPASSWORD, MONGOURL, APPNAME } = process.env;
  const uri = `mongodb+srv://${USERID}:${MONGODBPASSWORD}@${MONGOURL}?retryWrites=true&w=majority&appName=${APPNAME}`;

  try {
    await mongoose.connect(uri);
    console.log("db connected");
    
    console.log("dropping existing model");
    await model.collection.drop();
    console.log("dropped existing model");

    console.log("inserting document in DB.");
    await model.insertMany(entries);
    console.log("document added to DB");
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.disconnect();
    console.log("db disconnected");
  }
}

seedProductData(ProductModel, products);
