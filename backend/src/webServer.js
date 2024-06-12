const express = require("express");
const cors = require("cors");

const { userRouter } = require("./routes/userRouter");
const { productRouter } = require("./routes/productRouter");

exports.startWebServer = function startWebServer(serverConfig) {
  const { host, port, cors: {origin, credentials} } = serverConfig;
  const app = express();

  
  app.use(cors({ origin , credentials }));
  app.use(express.json());
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);

  return new Promise((resolve, reject) => {
    app.listen(port, host, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Listening on host ${host} and port ${port}`);
        resolve();
      }
    });
  });
};
