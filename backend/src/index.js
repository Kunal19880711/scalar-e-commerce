const { mongoConnect } = require("./mongoConnect");
const { startWebServer } = require("./webServer");

require("dotenv").config();

const { MONGO_USERID, MONGO_DBPASSWORD, MONGO_URL, MONGO_APPNAME, SERVER_PORT, SERVER_HOST } = process.env;
const mongoConfig = {
  userid: MONGO_USERID,
  mongodbpassword: MONGO_DBPASSWORD,
  mongourl: MONGO_URL,
  appname: MONGO_APPNAME,
};
const serverConfig = {
  host: SERVER_HOST,
  port: SERVER_PORT,
};

start();

async function start() {
  try {
    await mongoConnect(mongoConfig);
    await startWebServer(serverConfig);
  } catch (err) {
    console.log(err);
  }
}
