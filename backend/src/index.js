const { mongoConnect } = require("./mongoConnect");
const { startWebServer } = require("./webServer");

require("dotenv").config();

const mongoConfig = {
  userid: process.env.MONGO_USERID,
  mongodbpassword: process.env.MONGO_DBPASSWORD,
  mongourl: process.env.MONGO_URL,
  appname: process.env.MONGO_APPNAME,
};
const serverCorsConfig = {
  origin: JSON.parse(process.env.SERVER_CORS_ORIGIN),
  credentials: JSON.parse(process.env.SERVER_CORS_CREDENTIALS),
};
const serverConfig = {
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT,
  cors: serverCorsConfig,
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
