const mongoose = require("mongoose");

exports.mongoConnect =  async function mongoConnect(mongoConfig) {
  const { userid, mongodbpassword, mongourl, appname } = mongoConfig;
  const uri = `mongodb+srv://${userid}:${mongodbpassword}@${mongourl}?retryWrites=true&w=majority&appName=${appname}`;
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
